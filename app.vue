<template>

  <Head>
    <Title>SOTFC</Title>
  </Head>
  <div class="body">
    <div class="bg absolute -z-10 w-full h-screen"></div>
    <div class="flex flex-col h-screen gap-2 p-2">
      <div class="menubar">
        <div class="navgroup justify-end">
          <NuxtLink class="navitem" to="/" active-class="active">
            <span>
              Home
            </span>
          </NuxtLink>
          <NuxtLink class="navitem" to="/events" active-class="active">
            <span>
              Events
            </span>
          </NuxtLink>
        </div>
        <div class="flex justify-center col-span-1">
          <NuxtLink class="navitem" to="/">
            <img src="assets/SOTFC_Banner.png" class="w-24 hover:scale-150 transition" />
          </NuxtLink>
        </div>
        <div class="navgroup justify-start">
          <NuxtLink class="navitem" to="/leaderboard" active-class="active">
            <span>
              Leaderboard
            </span>
          </NuxtLink>
          <NuxtLink class="navitem" to="/contestants" active-class="active">
            <span>
              Contestants
            </span>
          </NuxtLink>
        </div>
      </div>
      <div class="content">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="postcss">
.body {
  overflow-x: hidden;
  overflow-y: hidden;
}

.bg {
  background-image: url('assets/background.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  filter: blur(18px) brightness(2);

  @media (prefers-color-scheme: dark) {
    filter: blur(8px) brightness(1);
  }
}

.content {
  @apply bg-[#111111cc] rounded h-full p-2;
  overflow: auto;

  &:hover::-webkit-scrollbar-thumb {
    background-color: #88888888;
    width: 5px;
  }

  /* Width */
  &::-webkit-scrollbar {
    background-color: transparent;
    width: 5px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 5rem;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    width: 0px;
    border-radius: 5rem;
    transition: width 0.2s ease-in-out;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

.menubar {
  @apply p-2 text-white rounded justify-center grid grid-cols-5;

  background-color: var(--sotfc-primary);
}

.navgroup {
  @apply flex col-span-2 gap-6
}

.navitem {
  @apply px-4 py-2 rounded cursor-pointer select-none;

  &.active {

    transition: box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out, color 0.1s ease-in-out;

    box-shadow: 0px 0px 0px 0px var(--sotfc-accent-fade);
    -webkit-box-shadow: 0px 0px 0px 0px var(--sotfc-accent-fade);
    -moz-box-shadow: 0px 0px 0px 0px var(--sotfc-accent-fade);

    &:hover {
      background-color: rgba(110, 250, 251, 0.85);
      color: black;

      box-shadow: 0px 0px 25px 1px var(--sotfc-accent-fade);
      -webkit-box-shadow: 0px 0px 25px 1px var(--sotfc-accent-fade);
      -moz-box-shadow: 0px 0px 25px 1px var(--sotfc-accent-fade);

      span {
        transition: 0.2s, background-position 0s 0.2s;

        --p: 0;
        --d: 0;

        background:
          linear-gradient(var(--sotfc-accent) 0 0) var(--p, 0) 100% /var(--d, 0) 3px no-repeat;
      }
    }

    span {
      @apply pb-1;
      --p: 100%;
      --d: 100%;

      background:
        linear-gradient(var(--sotfc-accent) 0 0) var(--p, 0) 100% /var(--d, 0) 3px no-repeat;
      transition: 0.25s, background-position 0s 0.25s;
    }
  }

  span {
    @apply pb-1;

    background:
      linear-gradient(var(--sotfc-accent) 0 0) var(--p, 0) 100% /var(--d, 0) 3px no-repeat;
    transition: 0.25s, background-position 0s 0.25s;
  }

  &:hover {
    span {
      --d: 100%;
      --p: 100%;
    }
  }
}
</style>