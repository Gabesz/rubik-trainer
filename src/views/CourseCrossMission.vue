<template>
  <CoursePageShell user-icon-suffix="cross-mission">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10 col-xl-9">
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb mb-3">
            <li class="breadcrumb-item">
              <router-link to="/">{{ $t('nav.home') }}</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link to="/course/beginner-cfop">{{ $t('course.title') }}</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ $t('course.modules.cross.title') }}
            </li>
          </ol>
        </nav>

        <h1 class="h2 mb-4">{{ $t('crossGame.pageTitle') }}</h1>
        <CrossMissionPlayer />
      </div>
    </div>
  </CoursePageShell>
</template>

<script setup>
import CoursePageShell from '../components/CoursePageShell.vue';
import CrossMissionPlayer from '../components/CrossMissionPlayer.vue';
</script>
