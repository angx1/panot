## Exposed Routes

> **Base**: `(adjust per environment)` - API Gateway

### Auth — `/v1/account`

| Method | Path                          | Description              |
| -----: | ----------------------------- | ------------------------ |
|    GET | `/v1/account/`                | Get user info            |
|  PATCH | `/v1/account/email`           | Change email             |
|  PATCH | `/v1/account/password`        | Change password          |
|   POST | `/v1/account/revoke-sessions` | Revoke sessions (logout) |
| DELETE | `/v1/account/terminate`       | Delete account           |

### Planner — `/v1/commands/planner`

| Method | Path                        | Description                                     |
| -----: | --------------------------- | ----------------------------------------------- |
|   POST | `/v1/commands/planner/plan` | Generate a list of actions from a transcription |

### Builder — `/v1/commands/builder`

#### Contacts

| Method | Path                                | Description                  |
| -----: | ----------------------------------- | ---------------------------- |
|   POST | `/v1/commands/builde>r/contact/`    | Create contact               |
|    GET | `/v1/commands/builder/contact/:id`  | Get contact by ID            |
|    GET | `/v1/commands/builder/contact/all`  | List user contacts           |
|  PATCH | `/v1/commands/builder/contact/:id`  | Update contact               |
| DELETE | `/v1/commands/builder/contact/:id`  | Delete contact               |
|   POST | `/v1/commands/builder/contact/list` | Get multiple contacts by IDs |

#### Jobs

| Method | Path                                   | Description                               |
| -----: | -------------------------------------- | ----------------------------------------- |
|    GET | `/v1/commands/builder/job/all`         | List all jobs (with their actions)        |
|    GET | `/v1/commands/builder/job/:id`         | Get a job by ID                           |
|   POST | `/v1/commands/builder/job/:id/approve` | Approve a job and execute all its actions |
| DELETE | `/v1/commands/builder/job/:id/deny`    | Deny and delete a job                     |

#### Job Actions

| Method | Path                                              | Description                   |
| -----: | ------------------------------------------------- | ----------------------------- |
|    GET | `/v1/commands/builder/job/:id/action/all`         | List actions for a job        |
|    GET | `/v1/commands/builder/job/:id/action/:id`         | Get an action by ID           |
|   POST | `/v1/commands/builder/job/:id/action/:id/approve` | Approve and execute an action |
| DELETE | `/v1/commands/builder/job/:id/action/:id/deny`    | Deny and delete an action     |
