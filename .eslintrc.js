module.exports = {
  env: { browser: true, es2021: true },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
  parserOptions: { ecmaVersion: 2021 },
  plugins: ["vue"],
  globals: {
    defineProps: "readonly",
    defineEmits: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly"
  },
  rules: {}
};
