<template>
  <router-view />
</template>

<script setup>
import { useTheme } from './composables/useTheme';

// Initialize theme - the composable handles everything
useTheme();
</script>

