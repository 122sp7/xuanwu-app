# Environment And Integrations

Firebase:
- infrastructure/firebase/client.ts initializes the Firebase web app.
- infrastructure/firebase/admin.ts reads FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.
- .env currently contains NEXT_PUBLIC_FIREBASE_* values and empty admin placeholders.

Upstash:
- lib/upstash contains box, qstash, redis, vector, workflow helpers.

Other integrations:
- infrastructure/axios/httpClient.ts for HTTP client concerns.
- lib/dragdrop for drag and drop abstraction.
- lib/xstate for state machine utilities.
- lib/vis for visualization-related helpers.

Caution:
- Only rely on integrations after checking whether the consuming feature already imports them.
- Some packages are installed even if feature integration is incomplete on this branch.
