module "hds_frontend_ecs" {
  source                         = "git@github.com:AdvancedFarm/infrastructure.git//terraform/modules/ecs-service?ref=master"
  env                            = var.env
  service_dns_name               = var.service_dns_name
  service_name                   = var.service_name
  service_subnets                = var.service_subnets
  load_balancer_subnets          = var.load_balancer_subnets
  service_port                   = var.service_port
  vpc_id                         = var.vpc_id
  ecs_cluster_arn                = var.ecs_cluster_arn
  service_docker_image           = var.service_docker_image
  service_health_check_path      = var.service_health_check_path
  service_environments_variables = var.service_environments_variables
  route53_priv_zone_id           = var.route53_priv_zone_id
  route53_pub_zone_id            = var.route53_pub_zone_id
  service_iam_policy_document    = var.service_iam_policy_document
  service_alb_ingress_sg_rules   = var.service_alb_ingress_sg_rules
}