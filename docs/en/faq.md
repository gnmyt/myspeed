# Questions & Answers

Here we answer the questions you might have.

::: details How do I install MySpeed?
Depending on your operating system these instructions are different. Here you can find the instructions
for [Windows](setup/windows) and [Linux](setup/linux).  
However, it is strongly recommended to install MySpeed on Linux.
:::

::: details What are the requirements?
It depends on what kind of bandwidth you have. For Linux, for example, it would be like this:
If you have a maximum of 100 Mbps on, then a RaspberryPi 1 or any other old computer will do the trick.
If you have a Gbit line, a Raspberry Pi 4 or a PC with 1Gbit LAN support would be important.
:::

::: details Can I use MySpeed despite VPN?
As long as you don't use your VPN service on the same system as the one where MySpeed is running, it's not a problem.
Otherwise, your VPN might distort the results or not reflect them realistically.
:::

::: details Does this information serve as official proof for my ISP?
No. The speed tests have to be done by the speed test service of your provider.
In this case MySpeed serves only for information purposes and has no legal guarantees.
:::

::: details What can influence the speed tests?
There are many factors that can influence the speed tests. For example, if you have a lot of background services
running, they can affect the results. It is best to turn them off at the respective test times, otherwise your
results could be manipulated.
:::

::: details What happens to the old test results?
The old test results are automatically deleted as soon as they are older than 30 days.
:::

::: details Does it have to run permanently?
We recommend it to get better results. If it bothers you while streaming movies etc.,
you can also pause it via the web interface for a certain time or manually.
For 24/7 operation, we recommend a system that doesn't need a lot of watts. In this case we recommend a Raspberry Pi.
If you already have a server running all the time, you can also run it there in parallel.
:::

::: details How can I distinguish between manual and automatic speed tests?
Click on the clock symbol of the respective test. There you will find all information about the speed test.
:::

::: details Does the "Recommendations" function show my correct bandwidth?
No, this is a calculated value from your last 10 speed tests. The available bandwidth will be found in your connection
contract.
:::

::: details Can the developer see my test results?
No, the test results are only visible locally on the server.
:::

::: details Why should I configure frequencies?
It depends very much on your internet. For example, if you have a very bad internet, you should rather decrease the
frequency. If your internet is quite fast, you can increase it. On this basis, more or less tests will be made,
depending on the situation.

::: warning Attention
It is very likely that background services are affecting your speeds. It is best to turn them off at the respective test
times, otherwise your results could be manipulated.
:::

::: details How do I reset my password?
You forgot your MySpeed password? It happens, no problem. To reset it, navigate to the installation
location (`cd /opt/myspeed`) and execute the following command:

```sh
node -e "const {Sequelize} = require('sequelize');const db = new Sequelize({dialect: 'sqlite', storage: 'data/storage.db'});db.query('UPDATE config SET value=? WHERE key=?', {replacements: ['none', 'password']})"
```    

Then you can go to the page again and set your password manually :)
:::