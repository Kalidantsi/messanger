<script setup lang="ts">
    const toast = useToast()
</script>

<template>
    <UButton label="Show toast" size="sm" @click="toast.add({ title: 'Hello world!'})" class="h-px"/>
</template>