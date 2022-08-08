module.exports.version = "1.1.1";
module.exports.list = [
    // MacOS
    {os: 'darwin', arch: 'x64', suffix: 'macosx-x86_64.tgz'},

    // Windows
    {os: 'win32', arch: 'x64', suffix: 'win64.zip'},

    // Linux
    {os: 'linux', arch: 'ia32', suffix: 'linux-i386.tgz'},
    {os: 'linux', arch: 'x64', suffix: 'linux-x86_64.tgz'},
    {os: 'linux', arch: 'arm', suffix: 'linux-armhf.tgz'},
    {os: 'linux', arch: 'arm64', suffix: 'linux-aarch64.tgz'},

    // FreeBSD
    {os: 'freebsd', arch: 'x64', suffix: 'freebsd12-x86_64.pkg'}
]