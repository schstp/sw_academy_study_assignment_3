<template>
    <div class="custom-select-wrapper" @click="showOptions">
      <div class="custom-select" :id="dropdownId">
        <div class="custom-select-btn">
          <span>{{ options[0] }}</span>
          <div class="arrow"></div>
        </div>
        <div class="custom-options">
          <span
            v-for="(option,index) in options"
            :key="index"
            :data-value="index"
            @click="changeSelected($event)"
            :class="['custom-option', index === 0 ? 'selected':'']">
            {{ option }}
          </span>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    options: {
      type: Array
    },
    dropdownId: {
      type: String
    }
  },
  methods: {
    showOptions: function () {
      const dropdown = document.getElementById(this.dropdownId)
      dropdown.classList.toggle('open')
    },
    changeSelected: function (e) {
      const option = e.target
      if (!option.classList.contains('selected')) {
        this.$emit('input', +option.getAttribute('data-value'))
        option.parentNode.querySelector('.custom-option.selected').classList.remove('selected')
        option.classList.add('selected')
        option.closest('.custom-select')
          .querySelector('.custom-select-btn span').textContent = option.textContent
      }
    }
  },
  beforeMount () {
    window.addEventListener('click', function (e) {
      const dropdowns = document.querySelectorAll('.custom-select')
      dropdowns.forEach(function (dropdown) {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('open')
        }
      })
    })
  }
}
</script>

<style lang="scss" scoped>
  *, *:after, *:before {
    box-sizing: border-box;
  }

  span {
    display: block;
  }

  .custom-select-wrapper {
    position: relative;
    user-select: none;
    width: 330px;
    font-family: Roboto, sans-serif;
    font-size: 18px;
  }

  .custom-select {
    position: relative;
    display: flex;
    flex-direction: column;
    border-width: 0 1px 0 1px;
    border-style: solid;
    border-color: #2596FF;
    border-radius: 10px;
    font: inherit;
  }

   .custom-select-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 22px;
    font-size: 20px;
    font-weight: 300;
    color: #3b3b3b;
    height: 60px;
    line-height: 40px;
    background: #ffffff;
    cursor: pointer;
    border-width: 1px 0 1px 0;
    border-style: solid;
    border-color: #2596FF;
     border-radius: 10px;
  }

  .custom-options {
    box-sizing: border-box;
    position: absolute;
    display: block;
    top: 100%;
    left: 0;
    right: 0;
    border: 1px solid #2596FF;
    border-top: 0;
    background: #fff;
    transition: all 0.5s;
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    z-index: 2;
  }

  .custom-select.open .custom-options {
    opacity: 1;
    visibility: visible;
    pointer-events: all;
    font: inherit;
    border-radius: 10px;
    overflow: hidden;
  }

  .custom-option {
    position: relative;
    display: block;
    padding: 0 22px 0 22px;
    font-size: 18px;
    font-weight: normal;
    color: #292929;
    line-height: 40px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .custom-option:hover {
    cursor: pointer;
    background-color: #efefef;
  }
  .custom-option.selected {
    color: #ffffff;
    background-color: #2596FF;
  }

  .arrow {
    position: relative;
    height: 15px;
    width: 15px;
  }
  .arrow::before, .arrow::after {
    content: "";
    position: absolute;
    bottom: 0;
    width: 0.15rem;
    height: 100%;
    transition: all 0.3s;
  }
  .arrow::before {
    left: -5px;
    transform: rotate(-45deg);
    background-color: #2596FF;
  }
  .arrow::after {
    left: 5px;
    transform: rotate(45deg);
    background-color: #2596FF;
  }
  .open .arrow::before {
    left: -5px;
    transform: rotate(45deg);
  }
  .open .arrow::after {
    left: 5px;
    transform: rotate(-45deg);
  }
</style>
