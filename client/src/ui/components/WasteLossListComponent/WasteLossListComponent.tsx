import { Button, FormControl, MenuItem, Select } from '@mui/material';
import styles from './WasteLossListComponent.module.scss'
import { useEffect, useState } from 'react';
import type { GetWastelossBatchFinishedProduct, GetWastelossFragrance, GetWastelossIngredient, GetWastelossPackaging } from '../../services/models/wasteLossModels';
import { GetWastelossFragrances, GetWastelossIngredients, GetWastelossPackagings, GetWastelossBatchFinished } from '../../services/WasteLossApiRoutes';



const WasteLossListComponent = () => {
  const [filter, setFilter] = useState("All");
  const [wasteLossFragrances, setWasteLossFragrances] = useState<GetWastelossFragrance[]>([]);
  const[wasteLossIngredients, setWasteLossIngredients] = useState<GetWastelossIngredient[]>([]);
  const [wasteLossPackagings, setWasteLossPackagings] = useState<
    GetWastelossPackaging[]
  >([]);
  const [wasteLossBatchFinishedProducts, setWasteLossBatchFinishedProducts] =
    useState<GetWastelossBatchFinishedProduct[]>([]);


  useEffect(() => {
    const fetchFragrances = async () => {
      try {
        const data = await GetWastelossFragrances();
        setWasteLossFragrances(data);
      } catch (error) {
        console.error("Failed to fetch waste loss fragrances:", error);
      }
    };

    const fetchIngredients = async () => {
      try {
        const data = await GetWastelossIngredients();
        setWasteLossIngredients(data);
      } catch (error) {
        console.error("Failed to fetch waste loss ingredients:", error);
      }
    };

    const fetchPackagings = async () => {
      try {
        const data = await GetWastelossPackagings();
        setWasteLossPackagings(data);
      } catch (error) {
        console.error("Failed to fetch waste loss packaging:", error);
      }
    };

    const fetchBatchFinishedProducts = async () => {
      try {
        const data = await GetWastelossBatchFinished();
        setWasteLossBatchFinishedProducts(data);
      } catch (error) {
        console.error(
          "Failed to fetch waste loss batch finished products:",
          error
        );
      }
    };

    
    

    fetchFragrances();
    fetchIngredients();
    fetchPackagings();
    fetchBatchFinishedProducts();
  }, []);

  // Combine lists based on filter
  let filteredList: (GetWastelossFragrance | GetWastelossIngredient)[] = [];

  switch (filter) {
    case "Fragrance":
      filteredList = wasteLossFragrances;
      break;
    case "Ingredients":
      filteredList = wasteLossIngredients;
      break;
    case "Packaging":
      filteredList = wasteLossPackagings;
      break;
    case "Finished Products":
      filteredList = wasteLossBatchFinishedProducts;
      break;
    case "All":
    default:
      // Here you can decide if you want to merge or show just fragrances first
      filteredList = [...wasteLossFragrances, ...wasteLossIngredients,...wasteLossPackagings,
        ...wasteLossBatchFinishedProducts];
      break;
  }
  return (
    <section className={styles.content}>
      <h1>Waste Loss</h1>

      <FormControl
        fullWidth
        style={{ marginBottom: "20px" }}
        className={styles.form}
      >
        <div className={styles.field}>
          <label className={styles.label}>Filter by Type</label>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={styles.select}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Fragrance">Fragrances</MenuItem>
            <MenuItem value="Packaging">Packaging</MenuItem>
            <MenuItem value="Finished Products">Finished Products</MenuItem>
            <MenuItem value="Ingredients">Ingredients</MenuItem>
          </Select>
        </div>
      </FormControl>

      <table className={styles.table}>
        <thead>
          <tr className={styles.tr}>
            <th>Item</th>
            <th>Type</th>
            <th>Quantity Lost</th>
            <th>Date of Loss</th>
            <th>Reason</th>
            <th>Recorded User</th>
            <th>Actions</th>
          </tr>
          <hr />
        </thead>
        <tbody>
          {filteredList.map((loss, index) => {
            const isFragrance = "fragrance" in loss;
            const isIngredient = "Ingredients" in loss || "ingredients" in loss;
            const isPackaging = "packaging" in loss;
            const isBatch = "finishedProduct" in loss;

            const itemName = isFragrance
              ? (loss as GetWastelossFragrance).fragrance?.name || "Unknown"
              : isIngredient
              ? (loss as GetWastelossIngredient).Ingredients?.name || "Unknown"
              : isPackaging
              ? (loss as GetWastelossPackaging).packaging?.name || "Unknown"
              : isBatch
              ? (loss as GetWastelossBatchFinishedProduct).finishedProduct
                  ?.ProductName || "Unknown"
              : "Unknown";

            const itemType = isFragrance
              ? "Fragrance"
              : isIngredient
              ? "Ingredient"
              : isPackaging
              ? "Packaging"
              : isBatch
              ? "Finished Product"
              : "Unknown";

            const quantityLoss = loss.quantityLoss;
            const dateOfLoss = new Date(loss.dateOfLoss).toLocaleDateString();
            const reason = loss.reason;
            const userName = loss.user?.name || "Unknown";

            return (
              <tr key={index}>
                <td>{itemName}</td>
                <td>{itemType}</td>
                <td>{quantityLoss}</td>
                <td>{dateOfLoss}</td>
                <td>{reason}</td>
                <td>{userName}</td>
                <td>
                  <Button className={styles.Btn}>Edit</Button>
                  <Button className={styles.Btn}>Delete</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default WasteLossListComponent;
