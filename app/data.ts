import { turso } from "~/turso";

export async function getFavorites() {
  return turso.execute(`SELECT * from favorite_listings`);
}

export async function addToFavorites(id: number) {
  const result = await turso.execute({
    sql: "INSERT OR IGNORE INTO favorite_listings (list_id) VALUES (?);",
    args: [id],
  });

  if (result.rowsAffected) {
    return { status: "added", message: "Item added to favorites" };
  }

  await turso.execute({
    sql: `DELETE FROM favorite_listings WHERE list_id = ?`,
    args: [id],
  });

  return { status: "removed", message: "Item removed from favorites" };
}
