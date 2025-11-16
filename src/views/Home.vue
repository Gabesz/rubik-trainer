<template>
  <main class="container py-5">
    <div class="row justify-content-center mb-4">
      <div class="col-lg-8 text-center">
        <h1 class="display-5 mb-3">Rubik's Cube F2L-OLL-PLL Trainers</h1>
        <p class="lead text-muted mb-0">
          Three focused trainers to learn and drill algorithms for 3×3:
          orientation (OLL), permutation (PLL), and first two layers (F2L).
        </p>
      </div>
    </div>

    <div class="row g-4 justify-content-center">
      <div class="col-12 col-lg-4">
        <div class="card h-100 app-card border-0 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h2 class="h4 mb-2">F2L Trainer</h2>
            <p class="text-muted mb-3">
              First Two Layers – practise the core 3×3 F2L cases with the same UX:
              SVG diagrams, filters, learned tracking, and custom alg notes.
            </p>
            <ul class="small text-muted mb-4">
              <li>Separated storage from the OLL/PLL apps</li>
              <li>Same filter/sort and training behaviour as the other trainers</li>
              <li>Data sourced from SpeedCubeDB's F2L set</li>
            </ul>
            <div class="mt-auto">
              <router-link to="/f2l" class="btn btn-outline-primary w-100">
                Open F2L Trainer
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card h-100 app-card border-0 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h2 class="h4 mb-2">OLL Trainer</h2>
            <p class="text-muted mb-3">
              Orientation of the Last Layer – practice all 57 OLL cases with SVG diagrams,
              filters, custom alg notes, and a focused training mode.
            </p>
            <ul class="small text-muted mb-4">
              <li>Filter by case type or learned state</li>
              <li>Editable personal algorithms with local save</li>
              <li>Random training from learned cases only</li>
            </ul>
            <div class="mt-auto">
              <router-link to="/oll" class="btn btn-primary w-100">
                Open OLL Trainer
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-4">
        <div class="card h-100 app-card border-0 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h2 class="h4 mb-2">PLL Trainer</h2>
            <p class="text-muted mb-3">
              Permutation of the Last Layer – drill the 21 PLL cases with the same UX:
              SVG diagrams, learned tracking, and custom alg management.
            </p>
            <ul class="small text-muted mb-4">
              <li>Separate learned/progress storage from the OLL app</li>
              <li>Case-type filters and short-alg sorting</li>
              <li>Training mode focused on your learned PLLs</li>
            </ul>
            <div class="mt-auto">
              <router-link to="/pll" class="btn btn-success w-100">
                Open PLL Trainer
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
// Landing page component
</script>

<style scoped>
body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: radial-gradient(circle at top, #f8f9fa 0, #e9ecef 45%, #dee2e6 100%);
}
.app-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.app-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.12);
}
</style>

