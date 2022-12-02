<template>
  <button
    class="switch"
    type="button"
    role="switch"
    title="toggle debug"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.switch {
  display: block;
  position: relative;
  width: 32px;
  height: 32px;
  padding: 0;
  text-align: center;
  border: 0;
  border-radius: 50%;
  color: var(--color-link);
  background: none;
  cursor: pointer;
  line-height: 1;
}

.switch:hover {
  color: var(--color-link-hover);
}

.switch::before {
  position: absolute;
  display: block;
  content: "";
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background-soft);
  border-radius: 50%;
}

.switch.active::before {
  filter: invert(0.1);
}

.switch.active > :first-child {
  filter: invert();
}
</style>