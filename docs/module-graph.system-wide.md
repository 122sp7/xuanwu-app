
==================== L0 ====================
---------------- platform subdomains ----------------

observability
logging
job-runner
config
event-bus
rate-limit
feature-flag
security-policy


---------------- iam subdomains --------------------

identity
authentication
authorization
tenant
session
access-control
platform
  ↓
iam
  ↓

┌────────────────────────────────────────────┐
│                L1 DOMAIN LAYER            │
└────────────────────────────────────────────┘

workspace            billing              ai
    ↓                   ↓                ↓


==================== L1 ====================

platform subdomains      iam subdomains
---------------------    ----------------------

observability            identity
logging                  authentication
job-runner               authorization
config                   tenant
security-policy          session
event-bus                access-control
rate-limit
feature-flag


==================== L2 ====================

workspace            billing            ai
   │                   │                │
   │                   │                │
   ▼                   ▼                ▼

account           subscription     context
account-profile   entitlement      memory
organization                        retrieval
team                               inference
notification                       orchestration
                                   tool-execution
                                   evaluation
                                   trace
                                   distillation
                                   routing
                                   prompt
                                   security
                                   schema
                                   feedback


==================== L3 ====================

notebooklm        notion
    │               │
    │               │
    ▼               ▼


---------------- notebooklm -----------------

context
memory
retrieval
inference
orchestration
tool-execution
trace
evaluation


------------------ notion -------------------

context
inference
orchestration
tool-execution
trace
evaluation
prompt
schema
feedback


==================== L4 ====================

all modules
  ↓
analytics (event sink)