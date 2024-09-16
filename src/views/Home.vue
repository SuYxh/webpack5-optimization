
<template>
    <div class="home-container">
        home 页面skskssk
    </div>
</template>
<script lang="ts" setup>

import { map } from 'lodash'

const numbers = [1, 2, 3, 4, 5]

const doubledNumbers = map(numbers, (num: number) => num * 2)

console.log('doubledNumbers', doubledNumbers); // 输出: [2, 4, 6, 8, 10]

</script>

