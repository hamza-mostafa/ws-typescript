import { UserModel } from "../users/users.model";
import { connect, disconnect } from "../database";

(async () => {
         connect();
         const users = [
             { firstName: "Emma", lastName: "Bradley", email: "email@example.com", channelsId: [1,2,4,5], userId: 1 },
             { firstName: "Elise", lastName: "Conner", email: "email@example.com", channelsId: [1,2,4,5], userId: 2 },
             { firstName: "Jack", lastName: "Lawson", email: "email@example.com", channelsId: [1,2,4,5], userId: 3 },
             { firstName: "Oliver", lastName: "Moss", email: "email@example.com", channelsId: [1,2,4,5], userId: 4 },
             { firstName: "Jamie", lastName: "Reid", email: "email@example.com", channelsId: [1,2,4,5], userId: 5 },
             { firstName: "Aidan", lastName: "Bradley", email: "email@example.com", channelsId: [1,2,4,5], userId: 6 },
             { firstName: "Jordan", lastName: "Gallagher", email: "email@example.com", channelsId: [4,5,6], userId: 7 },
             { firstName: "Erin", lastName: "Miles", email: "email@example.com", channelsId: [4,5,6], userId: 8 },
             { firstName: "William", lastName: "May", email: "email@example.com", channelsId: [1,2,3], userId: 9 },
             { firstName: "Ethan", lastName: "Butler", email: "email@example.com", channelsId: [1,2,3], userId: 10 }
         ];
         try {
             for (let user of users) {
                 // @ts-ignore
                 await UserModel.create(user);
                 console.log(`Created user ${user.firstName} ${user.lastName}`);
             }
             disconnect();
         } catch (e) {
             console.error(e);
         }
     })();
