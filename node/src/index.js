const Realm = require('realm');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const tokenManager = require('./token-manager')

const PORT = process.env.PORT ? process.env.PORT : 3000;
const ROS_HOST = process.env.ROS_HOST ? process.env.ROS_HOST : 'localhost'
const ROS_PORT = process.env.ROS_PORT ? process.env.ROS_PORT : '9080'
const REALM_AUTH_SERVER_URL = `http://${ROS_HOST}:${ROS_PORT}`;
const REALM_SERVER_URL = `realm://${ROS_HOST}:${ROS_PORT}`;  // or use `realm://`
const REALM_CONTENT_NAME = 'nodetest'

const timeout = ms => new Promise(res => setTimeout(res, ms))

const realmLogin = async function (forceAuthentication, containerName='admin') {
  console.log("Realm login...");

  try {
    console.log("Generating token...");
    const token = tokenManager.getAdminToken(containerName, 9000000)
    console.log("Getting credentials...");
    var credentials = Realm.Sync.Credentials.jwt(token)
    console.log("Realm Login...");
    adminUser = await Realm.Sync.User.login(REALM_AUTH_SERVER_URL, credentials)
    console.log("Realm authenticated!")
    return adminUser
  } catch (e) {
    console.log("Failed to authenticate realm! " + e.code);
    const milisec = 10000
    console.log("Retrying authentication in " + milisec/1000 + " seconds" )
    await timeout(milisec)
    return realmLogin(true, containerName)
  }
}

var realm;
const getRealmInstance = async function (user) {
  if(realm && !realm.isClosed)
    return realm
  try {
    console.log("Opening realm instance...")
    realm = await Realm.open({
      sync: {
        user,
        fullSynchronization: true,
        url: REALM_SERVER_URL + REALM_CONTENT_NAME,
        validate_ssl: false,
        error: (name, message, isFatal, category, code) => {
          console.log(name + message + isFatal + category + code)
        },
      },
      schema: [
        Realm.Permissions.Role,
        Realm.Permissions.User,
        Realm.Permissions.Permission,
        Realm.Permissions.Realm,
        Realm.Permissions.Class,
      ],
      schemaVersion: 1
    }).catch(e => {
      console.log(e)
    })
    return realm;
  } catch (e) {
    console.log("Failed to open realm")
  }
}

async function main() {
  var adminUser = await realmLogin(true, 'node_listener')
  if(adminUser){
    var instance = await getRealmInstance(adminUser)
  }
}
main()



app.get('/', function (req, res) { res.send('Node listener is up!') })
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
