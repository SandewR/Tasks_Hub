# TasksHub

TasksHub is an Expo Router app for Mobile Application Development Practical 07. It has a Dashboard tab, a Profile tab, and an Add New Task modal. Tasks and a student profile are saved on the device using AsyncStorage. Saving a task triggers a local notification on Android/iOS. The Profile screen opens the system photo picker, saves the selected image, and can clear the app's saved data.

## Run it

Use Node.js LTS and an Expo Go installation that supports SDK 58. Open this folder in VS Code, then run these commands in **Command Prompt**:

```cmd
npm ci
npx expo start --clear
```

Start your Android emulator and press **a** in the Expo terminal. Use the Android app for the notification and gallery screenshots. The web version is useful for checking the screen layout; it does not issue native notifications.

See [LAB_GUIDE.md](LAB_GUIDE.md) for the code walkthrough, Android checks, and submission steps. Add your own screenshots under [Output_Screens](Output_Screens).

## Image sources

The background and Add Task banner load from the [Magnific background](https://img.magnific.com/free-vector/isometric-time-management-concept-illustrated_52683-55534.jpg?semt=ais_hybrid&w=740&q=80) and [Vecteezy banner](https://static.vecteezy.com/system/resources/previews/016/921/110/non_2x/business-task-management-illustration-concept-on-white-background-vector.jpg) supplied in the lab handout. The app still opens and saves data if those decorative images cannot load.
