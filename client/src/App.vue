<template>
  <div class="wrapper">
    <div class="action-boxes">
      <div class="action-box" @click="generatePhoneNumber()">Generate</div>
      <div class="action-box" @click="getAllPhoneNumbers()">View</div>
    </div>
    <div 
      v-if="showAlert"
      :class="['alert', {
        'alert-success': isSuccessAlert, 
        'alert-error': isErrorAlert
      }]"
      v-html="msgAlert" />
      <div class="phone-numbers-container" v-show="showPhoneNumbers">
        <div class="action-boxes">
          <span>Total: {{phoneNumbers.length + 1 }}</span>
          <div class="action-box" @click="sortPhoneNumbers()">Sort</div>
        </div>
        <div class="max-min-container">
          <span><strong>Max:</strong> {{ maxNumber}}</span>
          <span><strong>Min:</strong> {{ minNumber}}</span>
        </div>
        <div class="phone-numbers">
          <span v-for="(item, index) in phoneNumbers" :key="index"> {{ item }}</span>
        </div>
      </div>
  </div>
</template>

<script>
import axios from './utils/axios';

export default {
  data(){
    return {
      showAlert: false,
      isSuccessAlert: false,
      isErrorAlert: false,
      msgAlert: '',
      phoneNumbers: [],
      sortOrder: '',
      maxNumber: '',
      minNumber: '',
      showPhoneNumbers: false,
    }
  },
  methods: {
    generatePhoneNumber() {
      return axios.post('/phone-numbers')
        .then(response => {
          this.showAlert = true;
          this.isSuccessAlert = true;
          this.msgAlert = `Phone number successfully generated. Your new phone number is <strong>${response.data.data}</strong>`;
          this.phoneNumbers.push(response.data.data);
          return response;
        })
        .catch(error => {
          this.showAlert = true;
          this.isErrorAlert = true;
          this.isSuccessAlert = false;
          this.msgAlert = error.response.data.msg;
          return error;
        });
    },
    getAllPhoneNumbers() {
      return axios.get('/phone-numbers')
        .then(response => {
          this.phoneNumbers = response.data.data;
          this.showPhoneNumbers = true;
          this.sortOrder = '';
          this.sortPhoneNumbers();
          this.getMaxMin()
          return response;
        })
        .catch(error => {
          this.showAlert = true;
          this.isErrorAlert = true;
          this.msgAlert = error.response.data.msg;
          return error;
        })
    },
    sortPhoneNumbers() {
      if(this.sortOrder === 'desc' || this.sortOrder === '') {
        this.phoneNumbers.sort((a,b) => {
          this.sortOrder = 'asc';
          return a-b;
        })
        this.getMaxMin();
      }  else if (this.sortOrder === 'asc') {
        this.phoneNumbers.sort((a,b) => {
          this.sortOrder = 'desc';
          return b-a;
        })
        this.minNumber = (this.phoneNumbers.slice(-1))[0];
        this.maxNumber = this.phoneNumbers[0];
      }
    },
    getMaxMin() {
      this.maxNumber = (this.phoneNumbers.slice(-1))[0];
      this.minNumber = this.phoneNumbers[0];
    }
  },
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.wrapper {
  width: 600px;
  min-height: 400px;
  max-height: 600px;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.2);
  margin: auto;
  padding: 10px;
  border-radius: 3px;
}

.action-boxes {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.action-box {
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 3px;
  width: 120px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  text-align: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    border-color: rgba(0, 0, 0, 0.1);
  }
}

.alert {
  margin: 30px 0;
  position: relative;
  padding: .75rem 1.25rem;
  border: 1px solid transparent;
  border-radius: .25rem;

  &-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
  }

  &-error {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
  }
}

.phone-numbers-container {
  margin: 30px 0;
}

.phone-numbers {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  margin: 30px 0;
}

.max-min-container {
  margin: 30px 0;
  display: grid;
  grid-template-columns: repeat(2, 200px);
  justify-content: center;
}
</style>
