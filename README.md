Demo backend

# Usage
Please refer to [full API documentation]()
## Environmental Variables

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
