import os
import re

files_to_update = [
    'modules/platform/AGENT.md',
    'modules/platform/README.md',
    'modules/platform/docs/aggregates.md',
    'modules/platform/docs/application-services.md',
    'modules/platform/docs/bounded-context.md',
    'modules/platform/docs/context-map.md',
    'modules/platform/docs/domain-events.md',
    'modules/platform/docs/domain-services.md',
    'modules/platform/docs/README.md',
    'modules/platform/docs/repositories.md',
    'modules/platform/docs/subdomains.md',
    'modules/platform/docs/ubiquitous-language.md'
]

new_subs = ['access-control', 'account', 'account-profile', 'analytics', 'audit-log', 'background-job', 'billing', 'compliance', 'content', 'feature-flag', 'identity', 'integration', 'notification', 'observability', 'onboarding', 'organization', 'platform-config', 'referral', 'search', 'security-policy', 'subscription', 'support', 'workflow']

for filename in files_to_update:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace 14 with 23
    content = content.replace('14 個', '23 個')
    content = content.replace('14 ', '23 ')
    content = content.replace('十四個', '二十三個')
    
    # Let's just do a naive append
    if 'subdomains.md' in filename:
        content += '\n\n## 新增的子域 (New 23):\n' + '\n'.join([f'- {sub}' for sub in new_subs])
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done running script")