import { UserModel } from "../users/users.model";
import { connect, disconnect } from "../database";
import {MessageModel} from "../messages/messages.model";


(async () => {
         connect();
         const users = [
             { firstName: "Emma", lastName: "Bradley", email: "email@example.com", channelsId: ["0142e098-009b-4b1a-b60c-40e0b6d2e363","8b818f27-850a-411c-8707-87601670e53e"], userId: "9ef96d82-7e96-4cc1-9293-738a11d50979" },
             { firstName: "Elise", lastName: "Conner", email: "email@example.com", channelsId: ["d65ba96b-4651-4faf-b592-f41f4fe2b403", "219df8fe-4c7f-4610-90b6-9718a4f8cbff"], userId: "dfea71ac-d605-4cd5-9b85-ede973dc7106" },
             { firstName: "Jack", lastName: "Lawson", email: "email@example.com", channelsId: ["308ad828-aa86-47f9-a5f9-8e8f218ab2bf"], userId: "698d1004-5d79-4a0d-8389-418d0010071d" },
             { firstName: "Oliver", lastName: "Moss", email: "email@example.com", channelsId: ["0142e098-009b-4b1a-b60c-40e0b6d2e363","8b818f27-850a-411c-8707-87601670e53e"], userId: "5b45192a-5eb5-4d7c-aad5-a5dd61f9fc23" },
             { firstName: "Jamie", lastName: "Reid", email: "email@example.com", channelsId: ["d65ba96b-4651-4faf-b592-f41f4fe2b403", "219df8fe-4c7f-4610-90b6-9718a4f8cbff"], userId: "97d6b716-e832-4a96-b849-031321b6493e" },
             { firstName: "Aidan", lastName: "Bradley", email: "email@example.com", channelsId: ["308ad828-aa86-47f9-a5f9-8e8f218ab2bf"], userId: "c525bb8f-d347-467a-8c87-708a71dfdd68" },
             { firstName: "Jordan", lastName: "Gallagher", email: "email@example.com", channelsId: ["0142e098-009b-4b1a-b60c-40e0b6d2e363","8b818f27-850a-411c-8707-87601670e53e"], userId: "5348369a-0546-4dac-a550-657347123a7f" },
             { firstName: "Erin", lastName: "Miles", email: "email@example.com", channelsId: ["d65ba96b-4651-4faf-b592-f41f4fe2b403", "219df8fe-4c7f-4610-90b6-9718a4f8cbff"], userId: "03ff9a7d-d962-4546-8ca6-fc3cb77a78b4" },
             { firstName: "William", lastName: "May", email: "email@example.com", channelsId: ["308ad828-aa86-47f9-a5f9-8e8f218ab2bf"], userId: "c9ed239f-7704-4e50-aa8c-444a5a3a13b7" },
             { firstName: "Ethan", lastName: "Butler", email: "email@example.com", channelsId: ["0142e098-009b-4b1a-b60c-40e0b6d2e363",
                     "8b818f27-850a-411c-8707-87601670e53e",
                     "d65ba96b-4651-4faf-b592-f41f4fe2b403",
                     "219df8fe-4c7f-4610-90b6-9718a4f8cbff",
                     "308ad828-aa86-47f9-a5f9-8e8f218ab2bf"], userId: "f245b901-4704-423a-b463-9ca7972cb8b5" }
         ];
         const messages = [
             {
                 fromUserId: 'f245b901-4704-423a-b463-9ca7972cb8b5',
                 toUserIds: [
                     "03ff9a7d-d962-4546-8ca6-fc3cb77a78b4",
                     "dfea71ac-d605-4cd5-9b85-ede973dc7106",
                     "97d6b716-e832-4a96-b849-031321b6493e"
                 ],
                 channelsId: [
                     "d65ba96b-4651-4faf-b592-f41f4fe2b403",
                     "219df8fe-4c7f-4610-90b6-9718a4f8cbff"
                 ],
                body: 'that should be a long Lorem Ipsum',
                type: 'text',
    seen: [
        {id: "03ff9a7d-d962-4546-8ca6-fc3cb77a78b4", status: true},
        {id: "dfea71ac-d605-4cd5-9b85-ede973dc7106", status: false},
        {id: "97d6b716-e832-4a96-b849-031321b6493e", status: false},
        ],
    acknowledged: [
        {id: "03ff9a7d-d962-4546-8ca6-fc3cb77a78b4", status: true},
        {id: "dfea71ac-d605-4cd5-9b85-ede973dc7106", status: true},
        {id: "97d6b716-e832-4a96-b849-031321b6493e", status: false},
        ]
         }];
         try {
             for (let user of users) {
                 // @ts-ignore
                 await UserModel.create(users);
                 await MessageModel.create(messages);
                 console.log(`Created user ${user.firstName} ${user.lastName}`);
             }
             disconnect();
         } catch (e) {
             console.error(e);
         }
     })();
