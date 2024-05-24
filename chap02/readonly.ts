const person: {
  readonly name: string;
  readonly age: number;
} = {
  name: "Ru",
  age: 24,
};

person.name = "Ru2"; // Error: Cannot assign to 'name' because it is a read-only property.
