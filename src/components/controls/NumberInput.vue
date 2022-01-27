<template>
  <v-text-field
    v-if="fields.text"
    label="Text"
    placeholder="-"
  >
    <template v-slot:prepend>
      <v-btn icon small>
        <v-icon small>
          mdi-minus-circle-outline
        </v-icon>
      </v-btn>
    </template>
    <template v-slot:append-outer>
      <v-btn icon small>
        <v-icon small>
          mdi-plus-circle-outline
        </v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>
