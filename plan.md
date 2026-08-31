# Phase: Bug Fixing (Explore Page & Create Post Flow)

## Context
We have successfully implemented the initial UI for the Explore feed and the Create Post modal, but there are two critical bugs that need to be fixed immediately.

## Bug 1: Duplicated Filters on the Explore Page
* **The Issue:** The category filter section (All, Housing, Inquiries, Guides) is duplicated and appearing twice on the screen.
* **Expected Behavior:** There should be only ONE horizontal scrollable filter bar at the top.
* **Action Required:** Inspect the Explore/Feed component. Identify where the duplication is happening (likely a leftover component from the old Housing page) and remove the redundant filter UI.

## Bug 2: Locked Category Selection in "Create Post"
* **The Issue:** When a user opens the content creation flow and selects a post type (e.g., clicks on 'Housing'), the selection gets locked. They cannot click on 'Inquiry' or 'Guide' to change their mind.
* **Expected Behavior:** The category selection should act like a group of radio buttons. The user must be able to freely switch between 'Housing', 'Inquiry', and 'Guide' at any time before submitting. The UI and the form fields should update dynamically based on the active selection.
* **Action Required:** Fix the state management (`onClick` handlers and `useState`) in the Create Post component so the user can easily toggle and switch between categories.

## Strict Instructions
Please analyze the code for both issues. Provide the fix for Bug 1 first, wait for my approval, and then provide the fix for Bug 2. Do not change any other unrelated logic.