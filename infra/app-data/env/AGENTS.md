# App Data environment tfvars

Store non-secret environment configuration files here. Populate one tfvars file per workspace and keep credentials (Aurora passwords, KMS keys) in Secrets Manager.

Recommended fields:

- `environment` — `dev`, `prod`, etc.
- `aws_region` — Region hosting Aurora and S3 (e.g., `eu-central-1`)
- `db_subnet_ids` — Private subnet IDs for the Aurora DB subnet group
- `db_security_group_ids` — Security groups allowed to connect to Aurora
- `backup_retention_days`, `preferred_backup_window`, `preferred_maintenance_window` — Override defaults when required
- `asset_buckets` — Optional overrides for bucket prefixes, lifecycle, or encryption
- `resource_tags` — Additional tags (Owner, Criticality, etc.)

Example usage:

```bash
terraform -chdir=infra/app-data plan \
  -var-file=env/dev.tfvars
```
