import React, { useEffect, useState } from "react";
import Header from "../pages/Header";
import useFetch from "../hooks/useFetch";
import {
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import "./Home.css";
// import './Category.css'
import axios from "axios";
import NewFooter from "../pages/NewFooter";
import SideBar from "./SideBar";
import MobileFilterDrawer from "./MobileFilterDrawer";
import FilterListIcon from "@mui/icons-material/FilterList";

const Category = () => {
  const { name } = useParams();
  // const category = useFetch(`/category/getCategoryByMainCategory/${name}`);
  // const product = useFetch(`/product/getProductByCategory/${name}`)

  const [product, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    ageGroups: [],
    brands: [],
    categories: [],
    discount: [],
    priceMin: "",
    priceMax: "",
  });

  const isMobile = useMediaQuery("(max-width:645px)"); //Mobile view
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false); //Mobile View

  // Handle updates from Sidebar
  const updateFilters = (newFilter) => {
    setFilters((prev) => ({ ...prev, ...newFilter }));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const noFiltersApplied =
          (filters.ageGroups?.length ?? 0) === 0 &&
          (filters.brands?.length ?? 0) === 0 &&
          (filters.categories?.length ?? 0) === 0 &&
          (filters.discount?.length ?? 0) === 0 &&
          !filters.priceMin &&
          !filters.priceMax;

        if (noFiltersApplied) {
          // No filters => fetch all products
          const res = await axios.get(`/product/getProductByCategory/${name}`);
          setProducts(res.data);
          return;
        } else {
          // Else: apply filters
          const query = new URLSearchParams();

          // Age groups
          filters.ageGroups.forEach((age) => query.append("ageGroups", age));
          filters.brands.forEach((brand) => query.append("brands", brand));
          filters.categories.forEach((cat) => query.append("categories", cat));
          filters.discount.forEach((disc) => query.append("discount", disc));

          if (filters.priceMin) query.append("priceMin", filters.priceMin);
          if (filters.priceMax) query.append("priceMax", filters.priceMax);

          const res = await axios.get(`/product/filter?${query.toString()}`);
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, [name, filters]);
  return (
    <>
      <Header />
      {/* Subcategory bar */}

      {/* <div className="category-bar">
  {category.data?.result?.map((cat) =>
    cat.subCategories?.map((sub, idx) => (
      <Link
        key={cat._id + '-' + idx}
        to={`/subcategory/${cat.mainCategory}/${sub}`}
        className="category-item"
      >
        {sub}
  
      </Link>
    ))
  )}
</div> */}

      {/* Mobile View */}
      {isMobile && (
        <>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              px: 2,
              pt: 2,
              position: "fixed",
              top: "60px",
              marginTop: "9%",
              background: "white",
              zIndex: 100,
              width: "90%",
              // borderBottom: "1px solid #ccc",
            }}
          >
            <Box sx={{ flexGrow: 1 }} /> {/* pushes the button to the right */}
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDrawerOpen(true)}
              sx={{ marginBottom: "10px" }}
            >
              Filter
            </Button>
          </Stack>
          {/* <Divider  /> */}
        </>
      )}
      <Stack direction={"row"}>
        {!isMobile && (
          <Box sx={{ display: "block", marginTop: "8%" }}>
            <SideBar filters={filters} onFilterChange={updateFilters} />
          </Box>
        )}
        <div className="product-style">
          {product.length === 0 ? (
            <p style={{ margin: "2rem", fontWeight: "bold" }}>
              No products found for selected filters.
            </p>
          ) : (
            <Grid container spacing={3}>
              {product?.map((prod) => (
                <Grid item xs={12} sm={6} md={3} key={prod._id} className="box">
                  <Link
                    style={{ color: "black", textDecoration: "none" }}
                    to={`/prodDetail/${prod._id}`}
                  >
                    <img
                      src={axios.defaults.baseURL + prod.thumbnail}
                      className="img-style"
                      alt={prod.title}
                    />
                    <p className="title">{prod.title}</p>
                    <p>
                      <span className="price-label">
                        {prod.actual_price} RS.
                      </span>
                      <span className="selling_label">
                        {prod.selling_price} RS.
                      </span>
                      <br />
                      {prod.discount > 0 && (
                        <span className="discount-badge">
                          {prod.discount}% OFF
                        </span>
                      )}
                      <br />
                      {prod.avail_qty < 1 ? (
                        <>
                          <span style={{ color: "red" }}>Out Of Stock</span>
                        </>
                      ) : (
                        <>
                          <span style={{ color: "red" }}>
                            {prod.avail_qty} items left
                          </span>
                        </>
                      )}
                    </p>
                  </Link>
                </Grid>
              ))}
            </Grid>
          )}
        </div>
      </Stack>

      <MobileFilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={updateFilters}
      />
      <NewFooter />
    </>
  );
};

export default Category;
