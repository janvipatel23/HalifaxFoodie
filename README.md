## Steps to follow to run the app

1. Clone git repo using `https://git.cs.dal.ca/smore/csci_5410_group11/-/tree/main`

2. `cd client`

3. Install all dependencies using `npm install`

4. Start application in dev environment using `npm run start`

5. `cd ..`

6. `cd server`

7. Install all dependencies using `npm install`

8. Start application in dev environment using `npm run start`

## A step by step process to deploy the app on Cloud Run

1. Create a docker image

2. Authorize cloud account

3. Tag docker image to the projectid

4. Push image to cloud registry

5. Create a cloud run service

## Tools and Software Used

- [NPM](https://www.npmjs.com/) - Nodejs package manager

- [CloudRun](https://halifax-foodie-final-version-qchzulw7qq-uc.a.run.app/) - Cloud platform to deploy application

- [VSCode](https://code.visualstudio.com/) - IDE used for development

- [Gitlab](https://git.cs.dal.ca/) - Repository and version control system

- [GCP](https://console.cloud.google.com/welcome?project=csci5410serverlessproject) - GCP Cloud Platform

## File Structure Modules
1. Cloud - The first root structure of file module is the cloud folder which contains all the code that is being implemented on cloud. It contains all the lambdas implemented and cloud functions implemented. It also contains the cloud formation script that is implemented to up the AWS Cognito in the AWS Console.

2. Public - It is the second node of the root structure that firebase-messaging file which is implemented to enable background notifications using Firestore cloud messaging service.

3. Components - The third node of tree structure consists of the important components of projects which is Chatbor, ChatRoom, and NavBar.

4. Pages - The fourth node of tree structure contains code implementation of all the important pages of an application.

5. App.js - It is the main engine of an application for running an app successfully.

6. firebase.js - It contains the firebase credentials of a gcp account.

# References

[1] K. Kokane, “Push notifications with react and Firebase,” LogRocket Blog, 01-Apr-2022. [Online]. Available: https://blog.logrocket.com/push-notifications-react-firebase/. [Accessed: 28-Nov-2022].

[2] “React select component - material UI,” React Select component - Material UI. [Online]. Available: https://mui.com/material-ui/react-select/. [Accessed: 29-Nov-2022]. 

[3] [Create CSV from cloud function](https://stackoverflow.com/questions/69399970 create-new-csv-file-in-google-cloud-storage-from-cloud-function)

[4] M. Malik, “Read data from dynamodb using AWS lambda function - apps developer blog,” Apps Developer Blog - Tutorials for Software Developers, 11-Mar-2022. [Online]. Available: https://www.appsdeveloperblog.com/read-data-from-dynamodb-using-aws-lambda-function/. [Accessed: 30-Nov-2022]. 

[5] J. Vitt, “Deploy a react app on GCP with Google Cloud Run,” DEV Community 👩‍💻👨‍💻, 16-Jan-2022. [Online]. Available: https://dev.to/johannesvitt/deploy-a-react-app-on-gcp-with-google-cloud-run-il3. [Accessed: 01-Dec-2022]. 

[6] “React-lex-plus,” npm. [Online]. Available: https://www.npmjs.com/package/react-lex-plus. [Accessed: 02-Dec-2022]. 

[7] https://www.youtube.com/watch?v=zQyrwxMPm88&t=60s

[8] “App Bar react component - material UI,” React component - Material UI. [Online]. Available: https://mui.com/material-ui/react-app-bar/. [Accessed: 03-Dec-2022]. 

[9] D. Landup, “Validate email addresses with regular expressions in JavaScript,” Stack Abuse, 17-Oct-2021. [Online]. Available: https://stackabuse.com/validate-email-addresses-with-regular-expressions-in-javascript/. [Accessed: 28-Nov-2022]. 

[10] “React text field component - material UI,” React Text Field component - Material UI. [Online]. Available: https://mui.com/material-ui/react-text-field/. [Accessed: 01-Dec-2022]. 

[11] “Typography API,” Material UI. [Online]. Available: https://mui.com/material-ui/api/typography/. [Accessed: 02-Dec-2022]. 
