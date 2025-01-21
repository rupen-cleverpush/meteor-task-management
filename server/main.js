import { Meteor } from 'meteor/meteor';
import { Accounts } from "meteor/accounts-base";
import {TasksCollection} from "../imports/api/TasksCollection"
import "../imports/api/TasksPublications"
import "../imports/api/tasksMethods"

async function insertTask(taskText, user) {
  await TasksCollection.insertAsync({ text: taskText, userId: user._id, createdAt: new Date()  });
}

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

Meteor.startup(async () => {
  if(!(await Accounts.findUserByUsername(SEED_USERNAME))) {
    await Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD
    });
  }

  const user = await Accounts.findUserByUsername(SEED_USERNAME);

  // If the Task collection is empty, add some data.
  if (await TasksCollection.find().countAsync() === 0) {
    [
      "first task",
      "second task",
      'third task',
      "fourth task",
    ].forEach((taskText)=>insertTask(taskText, user));
  }

  Meteor.publish("links", function () {
    return TasksCollection.find();
  });
});
  