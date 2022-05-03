<template>
    <div class="information--point point-0 visible">
        <div class="information--label"></div>
        <div class="information--text">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Informations',
  mounted () {
  },
  beforeDestroy () {
  }
})

</script>

<style scoped>
    .information--point
    {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .information--point .information--label
    {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #FFFFFF;
        color: #ffffff;
        font-family: Helvetica, Arial, sans-serif;
        text-align: center;
        line-height: 40px;
        font-weight: 100;
        font-size: 14px;
        transition: all .5s ease-in-out;
    }
    .information--point .information--text
    {
        width: 0;
        position: absolute;
        top: 9px;
        left: 5px;
        font-size: 14px;
        opacity: 1;
        cursor: help;
        border-top: 2px solid white;
        transition: all 0.3s ease-in-out;
        height: 0;
    }
    .information--point .information--text p
    {
        margin-left: 30px;
        background: #ffffff77;
        font-size: 14px;
        pointer-events: none;
        cursor: help;
        height: 0px;
        overflow: hidden;
    }
    .information--point .information--text p {
        color: #000000;
        line-height: 1.3em;
        font-weight: 100;
        font-family: Helvetica, Arial, sans-serif;
        /* opacity: 0; */
    }
    .information--point:hover .information--text
    {
        width: 200px;
        height: fit-content;
    }
    .information--point:hover .information--text p
    {
        height: fit-content;
    }
    .information--point:hover .information--label {
        transform: scale(1.5, 1.5);
    }
</style>
