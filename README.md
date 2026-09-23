# nodejs-22-arm64-vpc-use1

This sample creates a Node.js 22 Lambda configured with the New Relic ARM64 layer and attached to private subnets in a dedicated VPC.

## What the stack creates

- VPC with DNS enabled
- Two public subnets
- Two private subnets
- Internet gateway
- One NAT gateway for outbound internet access from the private subnets
- Dedicated Lambda security group with outbound egress enabled
- Layer ARN derived from the deployment region via `${AWS::Region}`

The Lambda runs only in the private subnets. The NAT gateway is required because the New Relic extension sends telemetry to external endpoints.

## Prerequisites

- SAM CLI
- Node.js 22
- A Docker-compatible container runtime for `sam local`, such as Rancher Desktop
- AWS credentials with permission to deploy Lambda, IAM, and VPC resources in `us-east-1`
- A valid New Relic ingest license key
- A New Relic account ID

## Layer behavior

For deployment to AWS Lambda, the function only references the layer ARN in the template. No manual layer download is required.

The layer ARN is built from the deployment region automatically. If the default New Relic layer version is not published in the customer's target region yet, override `NewRelicLayerVersion` during deployment.

For `sam local invoke`, SAM may download or mount the referenced layer into the local Docker container so the wrapper entrypoint exists locally. That is only for local emulation.

`sam local` does not require Docker Desktop specifically. Rancher Desktop works as long as it exposes a Docker-compatible socket and CLI.

## Build and deploy

```bash
export AWS_PROFILE=<your-profile>
export AWS_REGION=<target-region>

cd nodejs-22-arm64-vpc-use1
sam build
sam deploy --guided
```

When prompted, provide values for `NewRelicAccountId` and `NewRelicLicenseKey`. If needed, also override `NewRelicLayerVersion` for the target region.

This repository includes `samconfig.example.toml` as a sanitized reference. The live `samconfig.toml` is ignored so guided deploys cannot accidentally commit environment-specific overrides.

This stack creates billable networking resources, most notably the NAT gateway.

## Local invoke

```bash
export AWS_PROFILE=<your-profile>
export AWS_REGION=<target-region>
export DOCKER_HOST=unix://$HOME/.rd/docker.sock

cd nodejs-22-arm64-vpc-use1
sam local invoke HelloWorldFunction --event events/event.json
```

If local invoke fails before the container starts, first verify Rancher Desktop is running and `docker version` succeeds.

If local invoke fails with `Please reauthenticate using 'aws login'`, refresh the active AWS session and rerun the command.

If local invoke fails while resolving the external layer, deploy the stack to AWS and test the real Lambda instead.

## Unit tests

```bash
cd hello-world
npm install
npm test
```

## GitHub readiness

- No credentials are stored in the template or handler code.
- Provide secrets such as `NewRelicLicenseKey` only at deploy time.
- Local build artifacts, dependency folders, and the live `samconfig.toml` are ignored via `.gitignore`.