# Troubleshooting

In this guide you will learn how to fix known errors with this service.

??? failure "Could not open the database file. Maybe it is damaged?"
    There can be several solutions to this error. Just work through all possibilities and your problem should be solved. :)

    1. Set the required permissions   
    To set the permissions, enter the command `chmod 700 /opt/myspeed`. (Replace /opt/myspeed with your installation location).
    
    2. Install the build essentials   
    It is currently possible that the error occurs because the `build-essential` package is not installed. Simply reinstall it with the command `sudo apt-get install build-essential`.
    
    3. Perform a new installation of the modules   
    First enter the command `rm -R node_modules` in the installation folder to delete the modules and then reinstall them with `npm install`.

??? failure "This MySpeed instance is currently in development mode"
    This is not really an error, just a backup to use the tool only in production environments.
    Set the environment variable `NODE_ENV` to the value `production`.   
    On Linux you can do this with `export NODE_ENV=production` and on Windows in the Powershell with `$env:NODE_ENV="production"`.   
    Also read the [guide for 24/7 installation](../setup/linux), if you plan to run MySpeed in the background and start it automatically 
    at system startup.