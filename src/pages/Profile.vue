<script setup>
import moment from "moment/moment";
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const router = useRouter();

// Load saved data from localStorage when component mounts
onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    router.push("/login");
  }
  fetchUser();
});
//User data
const user = ref();
const isEditingEmail = ref(false);

const emailInput = ref(null);
const isEditingPhoto = ref(false);



//edit mail
function editEmail() {
  isEditingEmail.value = true;
  nextTick(() => emailInput.value?.focus());
}
const showPasswordFields = ref(false);
const passwords = ref({
  old: "",
  new: "",
  confirm: "",
});

function cancelEditMode() {
  isEditingEmail.value = false;
  showPasswordFields.value = false;
}

async function fetchUser() {
  try {
    const backend = import.meta.env.VITE_BACKEND;
    const token = localStorage.getItem("token");
    const res = await fetch(`${backend}/users`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json.message);
      if(res.status=== 401){
        localStorage.removeItem("token")
        router.push("/login")
      }
      return;
    }
    user.value = json.user;
  } catch (error) {
    alert("Error:" + error.message);
  }
}

//save user data
async function saveUserData() {
  try {
    const backend = import.meta.env.VITE_BACKEND;
    const token = localStorage.getItem("token");
    // if (showPasswordFields.value) {
    //   if (
    //     !passwords.value.old ||
    //     !passwords.value.new ||
    //     !passwords.value.confirm
    //   ) {
    //     toast.error("Enter all Password Field");
    //     return;
    //   }
    //   if (!passwords.value.new || !passwords.value.confirm) {
    //     toast.error("Password are not matching");
    //     return;
    //   }
    // }
    const updateData = {};
    if (isEditingEmail.value) {
      updateData.email = user.value.email;
    }
    if (showPasswordFields.value) {
      updateData.password = passwords.value.new;
      updateData.oldPassword = passwords.value.old;
    }
    const response = await fetch(`${backend}/users`, {
      method: "PATCH",
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const json = await response.json();
    if (!response.ok) {
      toast.error(json.message || "Failed to save data");
      if(res.status=== 401){
        localStorage.removeItem("token")
        router.push("/login")
      }
      return;
    }
    if(json.token){
      localStorage.setItem("token",json.token)
    }
    toast.success("User data updated!");
    passwords.value.new = "";
    passwords.value.confirm = "";
    showPasswordFields.value = false;
    isEditingEmail.value = false;
  } catch (error) {
    toast.error("Error:" + error.message);
  }
}
//upload photo
async function uploadPhoto(event) {
  try {
    const backend = import.meta.env.VITE_BACKEND;
    const token = localStorage.getItem("token");

    const formData = new FormData();
    
    formData.append("photo", event.target.files[0]);
    const response = await fetch(`${backend}/users/photo`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json = await response.json();
    if (!response.ok) {
      toast.error(json.message || "Failed to upload photo");
      if(res.status=== 401){
        localStorage.removeItem("token")
        router.push("/login")
      }
      return;
    }
    toast.success("Photo Uploaded Successfully !");
    isEditingPhoto.value = false;
    user.value.photo = json.photo;
  } catch (error) {
    toast.error("Error:" + error.message);
  }
}

//delete photo
async function deletePhoto() {
  try {
    const backend = import.meta.env.VITE_BACKEND;
    const token = localStorage.getItem("token");
    
    
    
    const response = await fetch(`${backend}/users/photo`, {
      method: "DELETE",
      headers: {
        
        Authorization: `Bearer ${token}`,
      },
      
    });

    const json = await response.json();
    if (!response.ok) {
      toast.error(json.message || "Failed to save data");
      if(res.status=== 401){
        localStorage.removeItem("token")
        router.push("/login")
      }
      return;
    }
    user.value.photo=null;
    toast.success("photo deleted successfully")
  } catch (error) {
    toast.error("Error:" + error.message);
  }
}

</script>

<template>
  <div v-if="user" class="container">
    <h2>User Profile</h2>
    <div class="preview-row">
      <div class="input-icon-wrapper">
        <img
          :src="
            user.photo ??
            'https://static.vecteezy.com/system/resources/previews/008/442/086/original/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg'
          "
          class="profile-pic"
          alt="Profile Picture"
        />
        <span v-if="isEditingPhoto">
          <input type="file" accept="image/*" @change="(e) => uploadPhoto(e)" />
          <span class="close" @click="deletePhoto">❌</span>
        </span>
        <template v-else>
          <span class="icon-pencil" @click="isEditingPhoto = true">✏️</span>
        </template>
      </div>
    </div>

    <div class="info">
      <!-- Name -->
      <label>
        <strong>Name:</strong>
        <div class="input-icon-wrapper">
          <template v-if="isEditingName">
            <input
              ref="nameInput"
              v-model="user.name"
              type="text"
              @blur="isEditingName = false"
            />
          </template>
          <template v-else>
            <span>{{ user.name || "N/A" }}</span>
          </template>
        </div>
      </label>

      <!-- Email -->
      <label>
        <strong>Email:</strong>
        <div class="input-icon-wrapper">
          <template v-if="isEditingEmail">
            <input
              ref="emailInput"
              v-model="user.email"
              type="email"
             
            />
          </template>
          <template v-else>
            <span>{{ user.email || "N/A" }}</span>
            <span class="icon-pencil" @click="editEmail">✏️</span>
          </template>
        </div>
      </label>

      <!-- Change password button -->
      <!-- Change password toggle -->
      <button
        class="change-btn"
        @click="showPasswordFields = !showPasswordFields"
      >
        Change Password
      </button>

      <!-- Password fields -->
      <div v-if="showPasswordFields" class="password-fields">
        <label>
          old Password:
          <input type="password" v-model="passwords.old" />
        </label>

        <label>
          New Password:
          <input type="password" v-model="passwords.new" />
        </label>
        <label>
          Confirm Password:
          <input type="password" v-model="passwords.confirm" />
        </label>
      </div>
      <!-- Gender -->
      <label>
        <strong>Gender:</strong>
        <div class="radio-group">
          <label v-if="user.gender === 'male'" class="gender-option"
            >♂ Male</label
          >
          <label v-else class="gender-option">♀ Female </label>
        </div>
      </label>

      <!-- Created At -->
      <p><strong>Created At:</strong>{{ moment(user.createdAt).fromNow() }}</p>

      <button
        class="save-btn"
        v-if="isEditingEmail || showPasswordFields"
        @click="saveUserData"
      >
        save
      </button>
      <button
        class="cancel-btn"
        v-if="isEditingEmail || showPasswordFields"
        @click="cancelEditMode"
      >
        cancel
      </button>
    </div>
  </div>

  <div v-else>
    <p>no data</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 30px auto;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.preview-row {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.profile-pic {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #ccc;
}

.info {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 15px;
}

.input-icon-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
}

.input-icon-wrapper input {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
}

.icon-pencil {
  cursor: pointer;
  font-size: 1.1rem;
  color: #007bff;
}

button.change-btn,
button.save-btn {
  margin-top: 10px;
  padding: 8px 14px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}

button.change-btn:hover,
button.save-btn:hover {
  background-color: #0056b3;
}

.password-fields input {
  width: 100%;
  padding: 6px 10px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.radio-group {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}

.gender-option {
  font-weight: 500;
  font-size: 1rem;
}
.close{
  cursor: pointer;
}
button.cancel-btn {
  margin-top: 10px;
  padding: 8px 14px;
  background-color: #dc3545; /* Bootstrap danger red */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-left: 10px; /* spacing from save button */
}

button.cancel-btn:hover {
  background-color: #a71d2a;
}

</style>
