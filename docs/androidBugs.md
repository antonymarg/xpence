# Android Runtime Bugs

Platform-specific issues that work on iOS but break or degrade on Android.

## Critical

### 1. ScrollView missing `keyboardShouldPersistTaps`

**File:** `app/(app)/addRecord.tsx:102`

The ScrollView wraps form inputs but has no `keyboardShouldPersistTaps="handled"`. On Android, tapping a different TextInput while the keyboard is open dismisses the keyboard instead of focusing the new input.

### 2. Card missing `overflow: "hidden"`

**File:** `components/Card.tsx:30-35`

`borderRadius` is applied but `overflow: "hidden"` is not. On iOS, content clips to borderRadius automatically. On Android, child content (colored backgrounds, images) bleeds outside the rounded corners.

### 3. Modals missing `onRequestClose`

**Files:** `components/settings/AddCategoryModal.tsx:50`, `components/settings/DeleteCategoryModal.tsx:23`

Neither Modal has `onRequestClose`. On Android, pressing the hardware back button closes the modal but the parent's state (`isAddModalVisible`, `deleteModalCategory`) never resets. The modal disappears visually but the app thinks it's still open — reopening may break or require a double tap.

### 4. `KeyboardAvoidingView` missing `keyboardVerticalOffset`

**Files:** `app/(app)/addRecord.tsx:85`, `app/(auth)/login.tsx:68`, `app/(auth)/signup.tsx:85`

All three use `behavior="height"` on Android inside a SafeAreaView + Stack layout, but no `keyboardVerticalOffset`. The keyboard can obscure the bottom form fields because the offset from the status bar / navigation header isn't accounted for.

## Low Priority

### 5. TabBar icon touch targets too small

**File:** `components/TabBar.tsx:25-74`

The nav icons have `paddingVertical: 8` — effective touch area is ~48x32px, below the 44x44pt minimum. Easy to mis-tap on Android.

### 6. CategoryTypePicker touch targets too small

**File:** `components/CategoryTypePicker.tsx:19-49`

Same issue — `paddingVertical: 8` makes buttons hard to tap accurately.
