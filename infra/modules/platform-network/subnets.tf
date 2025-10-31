resource "aws_subnet" "public" {
  for_each = var.public_subnets

  vpc_id                  = aws_vpc.this.id
  availability_zone       = each.value.az
  cidr_block              = each.value.cidr_block
  map_public_ip_on_launch = true

  tags = merge(local.base_tags, {
    Name = "${var.name}-public-${substr(each.value.az, -1, 1)}"
    Tier = "public"
  }, each.value.tags)
}

resource "aws_subnet" "private" {
  for_each = var.private_subnets

  vpc_id                  = aws_vpc.this.id
  availability_zone       = each.value.az
  cidr_block              = each.value.cidr_block
  map_public_ip_on_launch = false

  tags = merge(local.base_tags, {
    Name = "${var.name}-private-${substr(each.value.az, -1, 1)}"
    Tier = "private"
  }, each.value.tags)
}
