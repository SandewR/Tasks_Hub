# Practical 07: setup, testing, and submission

## 1. Start the app in Windows

1. Extract the ZIP. Open the **TasksHub** folder in VS Code with **File > Open Folder**. Check that you can see `package.json` and `app` in the Explorer.
2. Open **Terminal > New Terminal**. Use the dropdown beside **+** to open a **Command Prompt** terminal.
3. Run these commands one at a time and wait for each to finish:

   ```cmd
   node -v
   npm ci
   npm run check
   npx expo start --clear
   ```

   Install a supported Node.js LTS version if `node -v` is not recognized. Keep the Expo terminal open after the QR code appears.

4. In Android Studio, open **Device Manager** and start **Pixel_4** or your other Android virtual device. Wait for the Android home screen, then press **a** in the Expo terminal. Allow notifications if Expo Go asks. This project uses Expo SDK 58; if Expo Go reports an SDK mismatch, follow the supported emulator install steps in [Expo's Android Studio guide](https://docs.expo.dev/workflow/android-studio-emulator/).
5. Expect a Dashboard with **Your Tasks**, **Add New Task**, and a **Profile** tab. Leave the Metro server running during tests. If a stale Metro session connects you to another project, stop that session with **Ctrl+C** and run these commands from the TasksHub folder.

If you already created a TasksHub folder, keep a copy of your work and extract this project separately before comparing files. The ZIP is already a clean project. There is no template reset step after extraction.

## 2. Read the project in the order the lab builds it

| Order | File | What to follow |
| --- | --- | --- |
| 1 | `app/_layout.tsx` and `lib/notifications.ts` | The root Stack opens the tabs first and opens `add-task` as a modal. The notification handler allows foreground banners and entries in the notification list. |
| 2 | `app/(tabs)/_layout.tsx` | The Tabs navigator names the Dashboard and Profile pages and gives each a MaterialCommunityIcons icon. |
| 3 | `app/add-task.tsx` and `lib/storage.ts` | The two inputs use `useState`. Save trims the fields, reads the existing `tasks` array, adds a record, and writes it using `JSON.stringify`. The description input is multiline and starts typing at the top. After saving, the app sends an immediate notification and returns to the Dashboard. |
| 4 | `app/(tabs)/index.tsx` | `useFocusEffect` calls `loadTasks()` every time this tab comes into focus. `JSON.parse` restores the array and a ScrollView shows the current task cards. |
| 5 | `app/(tabs)/profile.tsx`, `lib/profile-photo.ts`, and `lib/storage.ts` | The photo button opens the gallery. Select and crop a picture, then use **Save Details**. On mobile, the app copies the photo into its own documents directory and saves its URI with the name and ID in `studentProfile`. When this screen mounts it reloads that profile. **Clear All Data** removes the `tasks` and `studentProfile` keys and deletes the saved avatar copy. |

The handout's install line has an extra `Task` before `expo-image-picker`. Its example also refers to a `moduleCode` variable that the pictured form does not collect. This implementation follows the pictured form: it stores and shows the **task name** and **task description** and puts the name in the notification.

### If you need to recreate the lab from a new Expo template

Use a fresh parent folder so the command does not collide with the extracted project:

```cmd
npx create-expo-app@latest TasksHub --template default@sdk-58
cd TasksHub
npm run reset-project
npx expo install @react-native-async-storage/async-storage expo-notifications expo-image-picker @expo/vector-icons expo-file-system
```

If the reset prompt offers to move the template to `example`, choose **Y** to keep a copy. Keep exactly one active routes directory. To match this ZIP and the lab, move the generated `src/app` (or `app`, depending on the template) outside the project or rename it out of the way before copying in the provided top-level `app`, `components`, and `lib`. Copy the provided `app.json`, assets, and README. Then run `npm run check` if you have copied this project's scripts, or `npx tsc --noEmit`; use `npx expo start --clear` to launch. The five route files are:

```text
app/
  _layout.tsx
  add-task.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    profile.tsx
```

## 3. Test and capture the output

1. **Empty dashboard:** On first launch, check that **No tasks saved yet** appears. Save `01-dashboard-empty.png`.
2. **Validation and task form:** Tap **Add New Task**. Try **Save Task** while the fields are empty, dismiss the message, then enter **Complete Practical 07** and **Capture a screenshot of the image picker and push to GitHub.** Save `02-add-task.png` before tapping Save. If the keyboard covers the button, dismiss the keyboard or scroll.
3. **Notification and saved task:** Tap **Save Task** and grant notifications if asked. Check that the new card appears. If the banner disappears quickly, swipe down from the Android status bar and capture the **Task Saved Successfully!** notification as `03-local-notification.png`. Close the shade and save `04-dashboard-saved-task.png` too.
4. **Image picker proof:** In **Profile**, tap the photo. Grant access if requested. Capture the actual Android picker before choosing a photo as `05-image-picker-open.png`. Do not use private photos in a submission screenshot. To get a test image, drag `assets/sample-profile-photo.jpg` from Windows Explorer onto the running emulator. Android places dragged files in Downloads. Look in the picker's **Browse** or **Downloads** location if available. If the image still is not listed, take a test picture with the emulator's **Camera** app and then reopen the picker.
5. **Save the profile:** Choose a photo and confirm the crop if prompted. Enter a name and Student ID, tap **Save Details**, dismiss the success message, and capture `06-profile-picture-saved.png`. Use sample details unless your lecturer requires your own ID.
6. **Persistence:** Close or force stop Expo Go, then reopen TasksHub from the still-running Expo terminal. The task must still be on the Dashboard. Return to Profile and check that the name, ID, and photo remain. Capture `07-profile-after-restart.png`.
7. **Clearing data:** Capture the earlier proof before this step. In Profile tap **Clear All Data > Clear**, dismiss the success message, and open Dashboard. The profile should be blank and the task list empty. Save `08-dashboard-after-clear.png`.

Use the **camera icon** on the Android emulator toolbar and save the PNGs into the project's `Output_Screens` folder. If the notification does not appear, check **Android Settings > Apps > Expo Go > Notifications**, enable notifications if disabled, and add a new task. This test uses a local notification; it does not ask for a push token or need a server.

## 4. Push to GitHub and submit

1. In GitHub, create an empty repository named **TasksHub**. Leave the boxes for README, .gitignore and license unchecked because this project already has files. Set the visibility your lecturer requires.
2. Verify **Output_Screens** contains the PNGs and the readme is present. In a **new CMD terminal** opened inside TasksHub:

   ```cmd
   git init
   git add .
   git status --short
   git commit -m "Complete TasksHub Practical 07"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/TasksHub.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` beforehand. If this folder already has a remote, run `git remote -v` and confirm it points to **TasksHub** before you push. If it is already correct, skip `git remote add origin`.

3. Refresh the repository page. Open **Output_Screens** and verify the image picker and saved profile PNGs are visible.
4. Copy the **repository URL**, open your Mobile Application Development **Practical 07** submission on **eKel**, and submit the link if the portal accepts it. The lab sheet lists **19 November**. If submissions are closed, ask the lecturer what late submission method they accept and include your repository link.
