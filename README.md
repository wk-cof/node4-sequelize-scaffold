Demo Node.js + Sequelize backend

# Usage
Please refer to [full API documentation](#docs)

## Installation
```bash
git clone https://github.com/wk-cof/node4-sequelize-scaffold.git
npm install
```

## Running
Before running, make sure you specified your required [environment variables](#environment_variables)
```
npm run start
```

## Docs

### Generating docs
```
npm run docs
```

### Accessing docs
Docs will be created in ./docs directory. Simply navigate to ./docs and open index.html.

## Environment Variables
*Environment variables can be set in node environment or provided in a env.json file.*

### verbosity
Specify verbosity level. Everything with this level's priority and above will be logged.
**Optional** Default value is "verbose"
Verbosity levels: 
```json
{
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
  silly: 5
}
```

### port
Port to listen to.
**Optional** Default value is 8001

### db_name
Database Name. 
**Required** App will fail on startup if no value is provided.
 
### db_user
Database username. 
**Required** App will fail on startup if no value is provided.

### db_password
Database password. 
**Required** App will fail on startup if no value is provided.

### db_host
URL to database location. 
**Required** App will fail on startup if no value is provided.

### db_dialect
Database username. 
**Optional** Default value is "mysql"
