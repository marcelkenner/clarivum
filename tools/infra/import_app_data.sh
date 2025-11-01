#!/usr/bin/env bash
set -euo pipefail

# Script to import existing Aurora and asset bucket resources into the
# infra/app-data Terraform workspace for dev and prod environments.
# It assumes Terraform provider binaries for Linux are already present.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
APP_DATA_DIR="${ROOT_DIR}/infra/app-data"

require_provider() {
  if [[ ! -d "${APP_DATA_DIR}/.terraform/providers" ]]; then
    echo "Terraform providers directory missing; run 'terraform -chdir=infra/app-data init' first."
    exit 1
  fi

  if ! find "${APP_DATA_DIR}/.terraform/providers/registry.terraform.io/hashicorp" -type f -name 'terraform-provider-aws_*' -perm -u+x -print -quit >/dev/null; then
    cat <<'EOF'
ERROR: Terraform provider binaries for Linux are missing.

Fix by either:
  1. Enabling outbound network and running: terraform -chdir=infra/app-data init -upgrade
  2. Mirroring providers on a networked machine:
       terraform providers mirror ./provider-cache
     then copy the hashicorp/aws and hashicorp/random directories into:
       infra/app-data/.terraform/providers/registry.terraform.io/
EOF
    exit 1
  fi
}

tf() {
  terraform -chdir="${APP_DATA_DIR}" "$@"
}

resource_in_state() {
  local address="$1"
  if tf state show "${address}" >/dev/null 2>&1; then
    return 0
  fi
  return 1
}

ensure_init() {
  if [[ ! -f "${APP_DATA_DIR}/.terraform/environment" ]]; then
    tf init
  fi
}

select_workspace() {
  local env="$1"
  if ! tf workspace select "${env}" >/dev/null 2>&1; then
    tf workspace new "${env}" >/dev/null 2>&1 || true
    tf workspace select "${env}"
  fi
}

import_bucket() {
  local tfvars="$1"
  local logical_key="$2"
  local bucket_name="$3"

  if aws s3api head-bucket --bucket "${bucket_name}" >/dev/null 2>&1; then
    local address="module.asset_buckets[\"${logical_key}\"].aws_s3_bucket.this"
    if resource_in_state "${address}"; then
      echo "Skipping import for ${address} (already present in state)."
    else
      tf import -var-file="${tfvars}" "${address}" "${bucket_name}"
    fi
  else
    echo "Skipping import for bucket '${bucket_name}' (not found or inaccessible)."
  fi
}

import_env() {
  local env="$1"
  local tfvars="env/${env}.tfvars"

  export TF_VAR_environment="${env}"
  export TF_VAR_aws_region="eu-central-1"

  select_workspace "${env}"

  case "${env}" in
    dev)
      if ! resource_in_state "module.aurora.aws_db_subnet_group.this"; then
        tf import -var-file="${tfvars}" module.aurora.aws_db_subnet_group.this platform-dev-db-subnets
      else
        echo "Skipping import for module.aurora.aws_db_subnet_group.this (already present)."
      fi
      if ! resource_in_state "module.aurora.aws_rds_cluster.this"; then
        tf import -var-file="${tfvars}" module.aurora.aws_rds_cluster.this platform-dev-aurora
      else
        echo "Skipping import for module.aurora.aws_rds_cluster.this (already present)."
      fi
      if ! resource_in_state "module.aurora.aws_rds_cluster_instance.this[0]"; then
        tf import -var-file="${tfvars}" 'module.aurora.aws_rds_cluster_instance.this[0]' platform-dev-aurora-instance-1
      else
        echo "Skipping import for module.aurora.aws_rds_cluster_instance.this[0] (already present)."
      fi
      import_bucket "${tfvars}" "ebooks-public" "clarivum-app-dev-ebooks-public"
      import_bucket "${tfvars}" "ebooks-private" "clarivum-app-dev-ebooks-private"
      ;;
    prod)
      if ! resource_in_state "module.aurora.aws_db_subnet_group.this"; then
        tf import -var-file="${tfvars}" module.aurora.aws_db_subnet_group.this platform-prod-aurora-subnet-group
      else
        echo "Skipping import for module.aurora.aws_db_subnet_group.this (already present)."
      fi
      if ! resource_in_state "module.aurora.aws_rds_cluster.this"; then
        tf import -var-file="${tfvars}" module.aurora.aws_rds_cluster.this platform-prod-aurora
      else
        echo "Skipping import for module.aurora.aws_rds_cluster.this (already present)."
      fi
      if ! resource_in_state "module.aurora.aws_rds_cluster_instance.this[0]"; then
        tf import -var-file="${tfvars}" 'module.aurora.aws_rds_cluster_instance.this[0]' platform-prod-aurora-01
      else
        echo "Skipping import for module.aurora.aws_rds_cluster_instance.this[0] (already present)."
      fi
      import_bucket "${tfvars}" "ebooks-public" "clarivum-app-prod-ebooks-public-dedb"
      import_bucket "${tfvars}" "ebooks-private" "clarivum-app-prod-ebooks-private-4dff"
      ;;
    *)
      echo "Unsupported environment: ${env}"
      exit 1
      ;;
  esac

  tf plan -var-file="${tfvars}"

  unset TF_VAR_environment TF_VAR_aws_region
}

main() {
  require_provider
  ensure_init

  import_env dev
  import_env prod
}

main "$@"
