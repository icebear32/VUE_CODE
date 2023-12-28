<script setup>
import { reactive } from 'vue'
import Tree from './Tree.vue'

const data = reactive([
    {
        name: '1',
        checked: false,
        children: [
            {
                name: '1-1',
                checked: false,
            }
        ]
    },
    {
        name: '2',
        checked: false,
    },
    {
        name: '3',
        checked: false,
        children: [
            {
                name: '3-1',
                checked: false,
                children: [
                    {
                        name: '3-1-1',
                        checked: false,
                    },
                    {
                        name: '3-1-2',
                        checked: false,
                    }
                ]
            }
        ]
    }
])
</script>

<template>
    <div>
        <Tree :data="data" />
    </div>
</template>