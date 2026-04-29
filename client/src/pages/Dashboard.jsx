import { useState, useEffect, useCallback, useRef } from "react";
import { api } from '../services/api';
import profileImage from "../assets/Bitmap.png";

const API_BASE = "http://localhost:3000/api";

export default function Dashboard() {
  // =====================
  // AUTH STATE
  // =====================
  
  // --- check if admin is already logged in from sessionStorage ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const loggedFlag = sessionStorage.getItem('admin_logged_in') === 'true';
    const hasEmail = Boolean(sessionStorage.getItem('admin_email'));
    const hasPassword = Boolean(sessionStorage.getItem('admin_password'));
    return loggedFlag && hasEmail && hasPassword;
  });
  
  // --- store admin email from sessionStorage ---
  const [adminEmail, setAdminEmail] = useState(() => {
    return sessionStorage.getItem('admin_email') || '';
  });
  
  // --- store admin password from sessionStorage ---
  const [adminPassword, setAdminPassword] = useState(() => {
    return sessionStorage.getItem('admin_password') || '';
  });
  
  // --- error message for login form ---
  const [authError, setAuthError] = useState('');
  
  // --- loading state for login button ---
  const [authLoading, setAuthLoading] = useState(false);

  // =====================
  // MAIN STATE
  // =====================
  
  // --- dashboard stats and orders from backend ---
  const [dashboardData, setDashboardData] = useState(null);
  
  // --- list of all products ---
  const [products, setProducts] = useState([]);
  
  // --- list of all categories ---
  const [categories, setCategories] = useState([]);
  
  // --- current page (dashboard, products, categories, add, orders, etc.) ---
  const [page, setPage] = useState("categories");
  
  // --- global loading indicator ---
  const [loading, setLoading] = useState(false);
  
  // --- delete confirmation modal ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // --- success message modal ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // --- text inside success modal ---
  const [successMessage, setSuccessMessage] = useState("");
  
  // --- ID of item to delete ---
  const [selectedId, setSelectedId] = useState(null);
  
  // --- currently selected category for detail/edit ---
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  // --- type of item being deleted (product or category) ---
  const [selectedDeleteType, setSelectedDeleteType] = useState("product");
  
  // --- modal for adding new category ---
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  
  // --- modal for editing category ---
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  
  // --- product being edited ---
  const [editingProduct, setEditingProduct] = useState(null);
  
  // --- modal for editing product ---
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  
  // --- detailed view of single category with its products ---
  const [showCategoryDetail, setShowCategoryDetail] = useState(false);
  
  // --- array of selected product IDs for bulk actions ---
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  
  // --- filter products by category name ---
  const [productCategoryFilter, setProductCategoryFilter] = useState("");
  
  // --- search text for products page ---
  const [productSearch, setProductSearch] = useState("");
  
  // --- search text from header bar ---
  const [headerSearch, setHeaderSearch] = useState("");
  
  // --- toggle profile dropdown menu ---
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // --- local overrides for category visibility (stored in localStorage) ---
  const [categoryVisibilityOverrides, setCategoryVisibilityOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem("category_visibility_overrides");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  
  // --- ref for detecting outside click on profile menu ---
  const profileMenuRef = useRef(null);
  
  // --- hidden file input for category image upload ---
  const categoryImageInputRef = useRef(null);
  
  // --- hidden file input for product image upload ---
  const productImageInputRef = useRef(null);
  
  // --- pagination state for products table ---
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  // =====================
  // FORM STATES
  // =====================
  
  // --- form data for adding/editing product ---
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    color: "",
    in_stock: true,
    size: "",
    rating: 0,
    is_new: false,
    tags: ""
  });
  
  // --- form data for adding/editing category ---
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    image: ""
  });
  
  // --- selected category names when adding a product ---
  const [selectedAddProductCategories, setSelectedAddProductCategories] = useState([]);
  
  // --- input value for adding new tag ---
  const [tagInput, setTagInput] = useState("");
  
  // --- list of tags for current product ---
  const [productTags, setProductTags] = useState(["T-Shirt", "Men Clothes", "Summer Collection"]);
  
  // --- SEO title field ---
  const [seoTitle, setSeoTitle] = useState("");
  
  // --- SEO description field ---
  const [seoDescription, setSeoDescription] = useState("");
  
  // --- discount price field ---
  const [discountPrice, setDiscountPrice] = useState("");
  
  // --- tax toggle ---
  const [addTax, setAddTax] = useState(false);
  
  // --- whether product has multiple options (size/color/material) ---
  const [hasMultipleOptions, setHasMultipleOptions] = useState(true);
  
  // --- dynamic option groups (Size, Color, Material) ---
  const [optionGroups, setOptionGroups] = useState([
    { id: 1, type: "Size", values: ["S", "M", "L", "XL"], input: "" }
  ]);
  
  // --- shipping weight input ---
  const [shippingWeight, setShippingWeight] = useState("");
  
  // --- shipping country select ---
  const [shippingCountry, setShippingCountry] = useState("");
  
  // --- whether product is digital (disables shipping) ---
  const [isDigitalItem, setIsDigitalItem] = useState(false);
  
  // --- computed: shipping disabled for digital items ---
  const isShippingDisabled = !isDigitalItem;

  // =====================
  // FETCH FUNCTIONS
  // =====================
  
  // --- fetch all products from API ---
  const fetchProducts = useCallback(async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      const productsArray = Array.isArray(data) ? data : [];
      setProducts(productsArray);
      setPagination({
        currentPage: pageNum,
        totalPages: Math.ceil(productsArray.length / 10) || 1,
        total: productsArray.length
      });
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // --- fetch all categories from API ---
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/categories`);
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // --- fetch dashboard data (stats and orders) from backend ---
  const fetchDashboardData = useCallback(async () => {
    if (!isAdminLoggedIn) return;
    
    try {
      const response = await api.post('/admin/dashboard-data', {
        email: sessionStorage.getItem('admin_email'),
        password: sessionStorage.getItem('admin_password')
      });
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  }, [isAdminLoggedIn]);

  // =====================
  // AUTH HANDLERS
  // =====================
  
  // --- handle admin login form submission ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    
    try {
      const response = await api.post('/admin/login', {
        email: adminEmail,
        password: adminPassword
      });
      
      if (response.data.success) {
        setIsAdminLoggedIn(true);
        sessionStorage.setItem('admin_logged_in', 'true');
        sessionStorage.setItem('admin_email', adminEmail);
        sessionStorage.setItem('admin_password', adminPassword);
        await Promise.all([
          fetchDashboardData(),
          fetchProducts(),
          fetchCategories()
        ]);
      }
    } catch (err) {
      setAuthError('Invalid admin credentials');
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  };
  
  // --- logout: clear all states and sessionStorage ---
  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setDashboardData(null);
    setProducts([]);
    setCategories([]);
    setPage("products");
    sessionStorage.removeItem('admin_logged_in');
    sessionStorage.removeItem('admin_email');
    sessionStorage.removeItem('admin_password');
  };

  // =====================
  // PRODUCT CRUD
  // =====================
  
  // --- add new product to API ---
  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.price) {
      alert("Please fill product name and price");
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          image: productForm.image || "/images/default.png",
          category: selectedAddProductCategories[0] || productForm.category,
          color: productForm.color,
          in_stock: isDigitalItem ? 0 : 1,
          size: hasMultipleOptions
            ? optionGroups.map((group) => `${group.type}: ${group.values.join(", ")}`).join(" | ")
            : productForm.size,
          rating: parseInt(productForm.rating) || 0,
          is_new: productForm.is_new ? 1 : 0,
          tags: productTags.join(", ")
        })
      });
      
      if (response.ok) {
        await fetchProducts();
        // --- reset all form fields after successful add ---
        setProductForm({
          name: "", description: "", price: "", image: "", category: "",
          color: "", in_stock: true, size: "", rating: 0, is_new: false, tags: ""
        });
        setSelectedAddProductCategories([]);
        setTagInput("");
        setProductTags(["T-Shirt", "Men Clothes", "Summer Collection"]);
        setSeoTitle("");
        setSeoDescription("");
        setDiscountPrice("");
        setAddTax(false);
        setHasMultipleOptions(true);
        setOptionGroups([{ id: 1, type: "Size", values: ["S", "M", "L", "XL"], input: "" }]);
        setShippingWeight("");
        setShippingCountry("");
        setIsDigitalItem(false);
        setSuccessMessage("Product added successfully!");
        setShowSuccessModal(true);
        setPage("products");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error adding product");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };
  
  // --- update existing product ---
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          image: productForm.image,
          category: productForm.category,
          color: productForm.color,
          in_stock: productForm.in_stock ? 1 : 0,
          size: productForm.size,
          rating: parseInt(productForm.rating) || 0,
          is_new: productForm.is_new ? 1 : 0,
          tags: productForm.tags
        })
      });
      
      if (response.ok) {
        await fetchProducts();
        setShowEditProductModal(false);
        setEditingProduct(null);
        setSuccessMessage("Product updated successfully!");
        setShowSuccessModal(true);
      } else {
        alert("Error updating product");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product");
    } finally {
      setLoading(false);
    }
  };
  
  // --- delete product by ID ---
  const handleDeleteProduct = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      
      if (response.ok) {
        await fetchProducts();
        setSuccessMessage("Product deleted successfully!");
        setShowSuccessModal(true);
      } else {
        alert("Error deleting product");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting product");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSelectedId(null);
    }
  };
  
  // =====================
  // CATEGORY CRUD
  // =====================
  
  // --- add new category, optionally assign a product to it ---
  const handleAddCategory = async () => {
    if (!categoryForm.name) {
      alert("Please enter category name");
      return;
    }
      
    setLoading(true);
    try {
      // first create the category
      const response = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryForm.name,
          image: categoryForm.image,
          is_visible: 1
        })
      });
        
      if (response.ok) {
        await response.json();
        
        // if a product was selected, update that product's category
        if (categoryForm.image && categoryForm.image !== "") {
          const selectedProduct = products.find(p => p.name === categoryForm.image);
          if (selectedProduct) {
            await fetch(`${API_BASE}/products/${selectedProduct.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...selectedProduct,
                category: categoryForm.name
              })
            });
          }
        }

        await fetchCategories();
        await fetchProducts();
        setCategoryForm({ name: "", image: "" });
        setShowAddCategoryModal(false);
        setSuccessMessage("Category added successfully!");
        setShowSuccessModal(true);
      } else {
        alert("Error adding category");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding category");
    } finally {
      setLoading(false);
    }
  };
  
  // --- update existing category ---
  const handleUpdateCategory = async () => {
    if (!selectedCategory) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/categories/${selectedCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryForm.name,
          image: categoryForm.image
        })
      });
      
      if (response.ok) {
        await fetchCategories();
        if (showCategoryDetail) {
          setSelectedCategory({ ...selectedCategory, name: categoryForm.name, image: categoryForm.image });
        }
        setShowEditCategoryModal(false);
        setSuccessMessage("Category updated successfully!");
        setShowSuccessModal(true);
      } else {
        alert("Error updating category");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating category");
    } finally {
      setLoading(false);
    }
  };
  
  // --- delete category by ID ---
  const handleDeleteCategory = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/categories/${id}`, { 
        method: "DELETE" 
      });
      
      if (response.ok) {
        await fetchCategories();
        setShowCategoryDetail(false);
        setSelectedCategory(null);
        setSuccessMessage("Category deleted successfully!");
        setShowSuccessModal(true);
      } else {
        alert("Error deleting category");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting category");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSelectedId(null);
    }
  };
  
  // --- open detailed view for a category ---
  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryDetail(true);
  };

  // --- get current visibility of a category (considering local overrides) ---
  const getCategoryVisibility = (category) => {
    if (!category) return true;
    if (Object.prototype.hasOwnProperty.call(categoryVisibilityOverrides, category.id)) {
      return Boolean(categoryVisibilityOverrides[category.id]);
    }
    return category.is_visible !== 0;
  };

  // --- toggle category visibility (optimistic update + API sync) ---
  const handleToggleCategoryVisibility = async (nextVisibility) => {
    if (!selectedCategory) return;

    const visibilityValue = nextVisibility ? 1 : 0;
    const categoryId = selectedCategory.id;

    // update localStorage and state immediately
    setCategoryVisibilityOverrides((prev) => {
      const updated = { ...prev, [categoryId]: nextVisibility };
      localStorage.setItem("category_visibility_overrides", JSON.stringify(updated));
      return updated;
    });

    setSelectedCategory((prev) => (prev ? { ...prev, is_visible: visibilityValue } : prev));
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, is_visible: visibilityValue } : cat
      )
    );

    // sync with server
    try {
      const response = await fetch(`${API_BASE}/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_visible: visibilityValue })
      });
      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }
    } catch (err) {
      console.warn("Server sync failed, visibility kept locally:", err);
    }
  };

  // --- handle category image file upload (convert to data URL) ---
  const handleCategoryImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageDataUrl = String(reader.result || "");
      setSelectedCategory((prev) => (prev ? { ...prev, image: imageDataUrl } : prev));
    };
    reader.readAsDataURL(file);
  };

  // --- handle product image file upload (convert to data URL) ---
  const handleProductImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageDataUrl = String(reader.result || "");
      setProductForm((prev) => ({ ...prev, image: imageDataUrl }));
    };
    reader.readAsDataURL(file);
  };

  // --- add a new tag to productTags array ---
  const handleAddProductTag = () => {
    const normalized = tagInput.trim();
    if (!normalized) return;
    if (productTags.some((tag) => tag.toLowerCase() === normalized.toLowerCase())) {
      setTagInput("");
      return;
    }
    setProductTags((prev) => [...prev, normalized]);
    setTagInput("");
  };

  // --- remove a tag from productTags array ---
  const handleRemoveProductTag = (tagToRemove) => {
    setProductTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  // --- toggle category selection when adding a product ---
  const handleToggleAddProductCategory = (categoryName) => {
    setSelectedAddProductCategories((prev) => {
      const exists = prev.includes(categoryName);
      const updated = exists ? prev.filter((name) => name !== categoryName) : [...prev, categoryName];
      setProductForm((formPrev) => ({ ...formPrev, category: updated[0] || "" }));
      return updated;
    });
  };

  // --- get default option values based on type (Size/Color/Material) ---
  const getDefaultOptionValues = (type) => {
    if (type === "Color") return ["White", "Black", "Red", "Blue", "Green"];
    if (type === "Material") return ["Cotton", "Linen", "Wool", "Denim"];
    return ["S", "M", "L", "XL"];
  };

  // --- change option type and reset values to defaults ---
  const handleOptionTypeChange = (groupId, nextType) => {
    setOptionGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, type: nextType, values: getDefaultOptionValues(nextType), input: "" }
          : group
      )
    );
  };

  // --- update temporary input value for an option group ---
  const handleOptionInputChange = (groupId, value) => {
    setOptionGroups((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, input: value } : group))
    );
  };

  // --- add new value to option group (on Enter or button click) ---
  const handleAddOptionValue = (groupId) => {
    setOptionGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        const normalized = group.input.trim();
        if (!normalized) return group;
        if (group.values.some((value) => value.toLowerCase() === normalized.toLowerCase())) {
          return { ...group, input: "" };
        }
        return { ...group, values: [...group.values, normalized], input: "" };
      })
    );
  };

  // --- remove a value from option group ---
  const handleRemoveOptionValue = (groupId, valueToRemove) => {
    setOptionGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, values: group.values.filter((value) => value !== valueToRemove) }
          : group
      )
    );
  };

  // --- add a new empty option group (Size by default) ---
  const handleAddOptionGroup = () => {
    setOptionGroups((prev) => [
      ...prev,
      { id: Date.now(), type: "Size", values: getDefaultOptionValues("Size"), input: "" }
    ]);
  };
  
  // --- open edit product modal and populate form with product data ---
  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      image: product.image || "",
      category: product.category || "",
      color: product.color || "",
      in_stock: product.in_stock === 1 || product.in_stock === true,
      size: product.size || "",
      rating: product.rating || 0,
      is_new: product.is_new === 1 || product.is_new === true,
      tags: product.tags || ""
    });
    setShowEditProductModal(true);
  };
  
  // =====================
  // HELPER FUNCTIONS
  // =====================
  
  // --- paginate products (10 per page) ---
  const getPaginatedProducts = (sourceProducts = products, pageNum = pagination.currentPage) => {
    const start = (pageNum - 1) * 10;
    const end = start + 10;
    return sourceProducts.slice(start, end);
  };
  
  // --- filter products by category name ---
  const getProductsByCategory = (categoryName) => {
    return products.filter(p => p.category === categoryName);
  };

  // --- normalize Persian/Arabic text for search ---
  const normalizeSearchText = (value = "") =>
    String(value)
      .replace(/[يى]/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/[ًٌٍَُِّْ]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  // --- filter products by category and search query ---
  const normalizedQuery = normalizeSearchText(productSearch);
  const filteredProducts = products.filter((p) => {
    if (productCategoryFilter && p.category !== productCategoryFilter) return false;
    if (!normalizedQuery) return true;

    const haystack = normalizeSearchText(p?.name || "");

    return haystack.includes(normalizedQuery);
  });
  
  // --- pagination calculations for filtered products ---
  const filteredTotalPages = Math.ceil(filteredProducts.length / 10) || 1;
  const effectiveCurrentPage = Math.min(pagination.currentPage, filteredTotalPages);
  const paginatedProducts = getPaginatedProducts(filteredProducts, effectiveCurrentPage);
  
  // --- check if all products on current page are selected ---
  const allVisibleSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((p) => selectedProductIds.includes(p.id));
  
  // =====================
  // INITIAL LOAD & SIDE EFFECTS
  // =====================
  
  // --- load dashboard data when admin is logged in ---
  useEffect(() => {
    if (isAdminLoggedIn) {
      setTimeout(() => {
        fetchDashboardData();
        fetchProducts();
        fetchCategories();
      }, 0);
    }
  }, [isAdminLoggedIn, fetchDashboardData, fetchProducts, fetchCategories]);

  // --- close profile menu when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =====================
  // RENDER LOGIN PAGE
  // =====================
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          
          {authError && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {authError}
            </div>
          )}
          
          <form onSubmit={handleAdminLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {authLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  // =====================
  // RENDER DASHBOARD
  // =====================
  return (
    <div className="flex h-screen bg-[#f4f6fb] text-[#1f2937] flex-col">
      {/* --- HEADER with logo, search, icons, and profile --- */}
      <header className="bg-white border-b border-[#e5e9f2] px-7 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 min-w-0">
            {/* logo and brand name */}
            <div className="flex items-center shrink-0">
              <div className="w-10 h-10 rounded-xl mr-3 shadow-[0_10px_24px_rgba(47,92,246,0.25)] overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="modernize-bg" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2F5CF6" />
                      <stop offset="0.55" stopColor="#5C7CFA" />
                      <stop offset="1" stopColor="#7C3AED" />
                    </linearGradient>
                    <linearGradient id="modernize-glass" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                      <stop stopColor="white" stopOpacity="0.95" />
                      <stop offset="1" stopColor="white" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <rect width="40" height="40" rx="12" fill="url(#modernize-bg)" />
                  <path d="M7 12.5C7 9.462 9.462 7 12.5 7H27.5C30.538 7 33 9.462 33 12.5V16H7V12.5Z" fill="white" fillOpacity="0.14" />
                  <path d="M9 28V12H13L20 21L27 12H31V28H27V18.7L20 27L13 18.7V28H9Z" fill="url(#modernize-glass)" />
                  <circle cx="31.5" cy="9.5" r="1.5" fill="white" fillOpacity="0.85" />
                </svg>
              </div>
              <span className="text-[40px] leading-none font-semibold text-[#1f2937]">Modernize</span>
            </div>
            {/* header search bar */}
            <div className="relative w-[360px] max-w-full">
              <input
                type="text"
                placeholder="Search..."
                value={headerSearch}
                onChange={(e) => {
                  const value = e.target.value;
                  setHeaderSearch(value);
                  if (page === "products") {
                    setProductSearch(value);
                    setPagination((prev) => ({ ...prev, currentPage: 1 }));
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setPage("products");
                    setShowCategoryDetail(false);
                    setProductSearch(headerSearch);
                    setPagination((prev) => ({ ...prev, currentPage: 1 }));
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e5e9f2] rounded-lg text-sm text-[#4b5568] focus:outline-none focus:border-[#95a4d1]"
              />
              <svg className="absolute left-3 top-3 w-4 h-4 text-[#9ca7bc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* header icons and profile */}
          <div className="flex items-center gap-5 shrink-0">
            <button className="relative text-[#68738f] hover:text-[#2f5cf6]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1.5 -right-1.5 w-[16px] h-[16px] text-[10px] rounded-full bg-[#2f5cf6] text-white flex items-center justify-center font-semibold">5</span>
            </button>

            <button className="text-[#68738f] hover:text-[#2f5cf6]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            {/* profile dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={profileImage}
                  alt="Admin profile"
                  className="w-8 h-8 rounded-full object-contain"
                />
                <span className="text-sm text-[#515b74] max-w-[130px] truncate">{adminEmail || "Xeriya Ronald"}</span>
                <svg
                  className={`w-4 h-4 text-[#7f8aa4] transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#e5e9f2] rounded-lg shadow-lg z-30 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#eef1f6]">
                    <p className="text-sm font-medium text-[#26324a] truncate">{adminEmail ? adminEmail.split("@")[0] : "Admin"}</p>
                    <p className="text-xs text-[#7f8aa4] truncate">{adminEmail || "admin@test.com"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#b42318] hover:bg-[#fff5f4]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* --- SIDEBAR navigation --- */}
        <div className="w-[250px] bg-[#f6f7fb] border-r border-[#e5e9f2] flex flex-col">
          <nav className="flex-1 pt-4 overflow-auto">
            <div className="px-3 mb-4">
              <ul className="space-y-2">
                {[
                  { name: "Dashboard", icon: "M3 12l9-9 9 9M4 10v10h16V10", key: "dashboard" },
                  { name: "Orders", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", key: "orders" },
                  { name: "Products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", key: "products" },
                  { name: "Categories", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10", key: "categories" },
                  { name: "Customers", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", key: "customers" },
                  { name: "Reports", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", key: "reports" },
                  { name: "Coupons", icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z", key: "coupons" },
                  { name: "Inbox", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", key: "inbox" }
                ].map((item) => (
                  <li key={item.name}>
                    <button 
                      onClick={() => {
                        setPage(item.key);
                        setShowCategoryDetail(false);
                      }} 
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-[15px] ${
                        page === item.key
                          ? "bg-[#2f5cf6] text-white"
                          : "text-[#68738f] hover:bg-[#edf1fb]"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <span className="text-sm">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="px-3 mt-7">
              <p className="text-xs font-semibold text-[#adb7cb] mb-3 px-3">Other Information</p>
              <ul className="space-y-2">
                <li className="text-sm text-[#68738f] px-3 py-2.5 rounded-md cursor-pointer hover:bg-[#edf1fb]">Knowledge Base</li>
                <li className="text-sm text-[#68738f] px-3 py-2.5 rounded-md cursor-pointer hover:bg-[#edf1fb]">Product Updates</li>
              </ul>
            </div>
            
            <div className="px-3 mt-7">
              <p className="text-xs font-semibold text-[#adb7cb] mb-3 px-3">Settings</p>
              <ul className="space-y-2">
                <li className="text-sm text-[#68738f] px-3 py-2.5 rounded-md cursor-pointer hover:bg-[#edf1fb]">Personal Settings</li>
                <li className="text-sm text-[#68738f] px-3 py-2.5 rounded-md cursor-pointer hover:bg-[#edf1fb]">Global Settings</li>
              </ul>
            </div>
          </nav>
        </div>
        
        {/* --- MAIN CONTENT area --- */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-7">
            
            {/* DASHBOARD PAGE */}
            {page === "dashboard" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl leading-none font-semibold text-[#202a3d]">Dashboard</h1>
                    <p className="text-sm text-[#6b7280] mt-2">
                      Overview of your store at a glance.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* total products card */}
                  <div className="bg-white border border-[#e7ebf4] rounded-xl p-5">
                    <p className="text-xs font-semibold text-[#9aa6bf]">Total Products</p>
                    <p className="text-3xl font-semibold text-[#202a3d] mt-2">
                      {typeof dashboardData?.stats?.totalProducts === "number"
                        ? dashboardData.stats.totalProducts
                        : products.length}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPage("products")}
                      className="mt-3 text-sm text-[#2f5cf6] hover:text-[#244ade]"
                    >
                      View products →
                    </button>
                  </div>

                  {/* total categories card */}
                  <div className="bg-white border border-[#e7ebf4] rounded-xl p-5">
                    <p className="text-xs font-semibold text-[#9aa6bf]">Total Categories</p>
                    <p className="text-3xl font-semibold text-[#202a3d] mt-2">
                      {typeof dashboardData?.stats?.totalCategories === "number"
                        ? dashboardData.stats.totalCategories
                        : categories.length}
                    </p>
                    <button
                      type="button"
                      onClick={() => setPage("categories")}
                      className="mt-3 text-sm text-[#2f5cf6] hover:text-[#244ade]"
                    >
                      Manage categories →
                    </button>
                  </div>

                  {/* admin info card */}
                  <div className="bg-white border border-[#e7ebf4] rounded-xl p-5">
                    <p className="text-xs font-semibold text-[#9aa6bf]">Admin</p>
                    <p className="text-lg font-semibold text-[#202a3d] mt-2 truncate">
                      {adminEmail || "Admin"}
                    </p>
                    <p className="text-sm text-[#6b7280] mt-2">
                      {dashboardData?.message || "You're all set to manage your store."}
                    </p>
                  </div>
                </div>

                {/* quick actions */}
                <div className="bg-white border border-[#e7ebf4] rounded-xl p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-[#202a3d]">Quick actions</h2>
                      <p className="text-sm text-[#6b7280] mt-1">Jump to the most used areas.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setPage("orders")}
                        className="h-10 px-4 rounded-md border border-[#dbe1ee] bg-white text-[#5f6b86] text-sm hover:bg-[#f7f9ff]"
                      >
                        Orders
                      </button>
                      <button
                        type="button"
                        onClick={() => setPage("products")}
                        className="h-10 px-4 rounded-md border border-[#dbe1ee] bg-white text-[#5f6b86] text-sm hover:bg-[#f7f9ff]"
                      >
                        Products
                      </button>
                      <button
                        type="button"
                        onClick={() => setPage("categories")}
                        className="h-10 px-4 rounded-md border border-[#dbe1ee] bg-white text-[#5f6b86] text-sm hover:bg-[#f7f9ff]"
                      >
                        Categories
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS PAGE (list view) */}
            {page === "products" && !showCategoryDetail && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl leading-none font-semibold text-[#202a3d]">Products</h1>
                  <div className="flex items-center gap-3">
                    <button className="h-10 px-5 rounded-md border border-[#dbe1ee] bg-white text-[#5f6b86] text-sm hover:bg-[#f7f9ff]">
                      Export
                    </button>
                    <button
                      onClick={() => setPage("add")}
                      className="h-10 px-5 rounded-md bg-[#2f5cf6] text-white text-sm hover:bg-[#244ade]"
                    >
                      + Add Product
                    </button>
                  </div>
                </div>
                
                {/* loading or empty state */}
                {loading && products.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-xl shadow-sm">Loading...</div>
                ) : products.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-xl shadow-sm">
                    <h3 className="text-lg font-medium mb-2">Add Products</h3>
                    <p className="text-gray-500 mb-4">Start making sales by adding your products.</p>
                    <p className="text-gray-500 mb-6">You can import and manage your products at any time.</p>
                    <button onClick={() => setPage("add")} className="bg-blue-600 text-white px-6 py-2 rounded-lg">+ Add Product</button>
                    <div className="mt-4">
                      <button className="text-blue-600">Read More →</button>
                    </div>
                  </div>
                ) : (
                  /* products table */
                  <div className="bg-white rounded-lg border border-[#e9edf7] p-6">
                    {/* search and filter bar */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <input
                          placeholder="Search Product..."
                          value={productSearch}
                          onChange={(e) => {
                            setProductSearch(e.target.value);
                            setPagination((prev) => ({ ...prev, currentPage: 1 }));
                          }}
                          className="h-10 w-[280px] border border-[#dbe1ee] rounded-md px-3 text-sm text-[#5f6b86] focus:outline-none focus:border-[#b8c2db]"
                        />
                        <select
                          value={productCategoryFilter}
                          onChange={(e) => {
                            setProductCategoryFilter(e.target.value);
                            setPagination((prev) => ({ ...prev, currentPage: 1 }));
                          }}
                          className="h-10 w-[280px] border border-[#dbe1ee] rounded-md px-3 text-sm text-[#5f6b86] bg-white focus:outline-none focus:border-[#b8c2db]"
                        >
                          <option value="">All</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      {/* bulk actions */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            const firstSelected = products.find((p) => selectedProductIds.includes(p.id));
                            if (firstSelected) openEditProductModal(firstSelected);
                          }}
                          disabled={selectedProductIds.length === 0}
                          className="h-10 w-10 rounded-md border border-[#dbe1ee] text-[#6b7690] hover:bg-[#f7f9ff] disabled:opacity-40 disabled:hover:bg-white"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => {
                            if (selectedProductIds.length === 0) return;
                            setSelectedId(selectedProductIds[0]);
                            setSelectedDeleteType("product");
                            setShowDeleteModal(true);
                          }}
                          disabled={selectedProductIds.length === 0}
                          className="h-10 w-10 rounded-md border border-[#dbe1ee] text-[#6b7690] hover:bg-[#f7f9ff] disabled:opacity-40 disabled:hover:bg-white"
                        >
                          🗑
                        </button>
                      </div>
                    </div>

                    {/* product table */}
                    <div className="overflow-hidden rounded-md border border-[#edf0f7]">
                      <table className="w-full">
                        <thead className="bg-[#fbfcff] border-b border-[#e9edf7]">
                          <tr className="text-left text-sm text-[#79839a]">
                            <th className="w-12 px-3 py-3">
                              <input
                                type="checkbox"
                                checked={allVisibleSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedProductIds((prev) => {
                                      const merged = new Set([...prev, ...paginatedProducts.map((p) => p.id)]);
                                      return Array.from(merged);
                                    });
                                  } else {
                                    setSelectedProductIds((prev) =>
                                      prev.filter((id) => !paginatedProducts.some((p) => p.id === id))
                                    );
                                  }
                                }}
                                className="accent-[#2f5cf6]"
                              />
                            </th>
                            <th className="px-3 py-3 font-medium">Product</th>
                            <th className="px-3 py-3 font-medium">Inventory</th>
                            <th className="px-3 py-3 font-medium">Color</th>
                            <th className="px-3 py-3 font-medium">Price</th>
                            <th className="px-3 py-3 font-medium">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedProducts.map((product) => {
                            const inStock = product.in_stock === 1 || product.in_stock === true;
                            return (
                              <tr key={product.id} className="border-b last:border-b-0 border-[#edf0f7] hover:bg-[#fafbff]">
                                <td className="px-3 py-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedProductIds.includes(product.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedProductIds((prev) => [...prev, product.id]);
                                      } else {
                                        setSelectedProductIds((prev) => prev.filter((id) => id !== product.id));
                                      }
                                    }}
                                    className="accent-[#2f5cf6]"
                                  />
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded bg-[#eef2f8] overflow-hidden">
                                      {product.image ? (
                                        <img
                                          src={product.image}
                                          alt={product.name}
                                          className="h-full w-full object-contain"
                                        />
                                      ) : null}
                                    </div>
                                    <div>
                                      <p className="text-base leading-none font-semibold text-[#202a3d] mb-1">{product.name}</p>
                                      <p className="text-xs leading-none text-[#9aa3b8]">{product.category || "T-Shirt"}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 py-3">
                                  {inStock ? (
                                    <span className="text-sm text-[#3d465d]">In stock</span>
                                  ) : (
                                    <span className="inline-flex bg-[#eef0ff] text-[#7c85a2] text-xs px-3 py-1 rounded">Out of Stock</span>
                                  )}
                                </td>
                                <td className="px-3 py-3 text-sm text-[#3d465d]">{product.color || "White"}</td>
                                <td className="px-3 py-3 text-sm text-[#3d465d]">${Number(product.price || 0).toFixed(2)}</td>
                                <td className="px-3 py-3 text-sm text-[#3d465d]">{Number(product.rating || 0).toFixed(1)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* pagination */}
                    <div className="pt-5 flex items-center justify-between text-sm text-[#6f7890]">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setPagination({ ...pagination, currentPage: Math.max(1, pagination.currentPage - 1) })}
                          disabled={effectiveCurrentPage === 1}
                          className="px-3 py-1 rounded hover:text-[#2f5cf6] disabled:opacity-40 disabled:hover:text-[#6f7890]"
                        >
                          Prev
                        </button>
                        <button
                          onClick={() => setPagination({ ...pagination, currentPage: Math.min(filteredTotalPages, effectiveCurrentPage + 1) })}
                          disabled={effectiveCurrentPage >= filteredTotalPages}
                          className="px-3 py-1 rounded hover:text-[#2f5cf6] disabled:opacity-40 disabled:hover:text-[#6f7890]"
                        >
                          Next
                        </button>
                      </div>
                      <p>{filteredProducts.length} Results</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* ADD / EDIT PRODUCT PAGE (form) */}
            {page === "add" && (
              <div className="max-w-[1240px] mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <button
                      onClick={() => setPage("products")}
                      className="text-sm text-[#6b7280] hover:text-[#111827] mb-1 flex items-center gap-1"
                    >
                      <span aria-hidden="true">←</span>
                      <span>Back</span>
                    </button>
                    <h1 className="text-[34px] leading-none font-semibold text-[#111827]">Add Product</h1>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPage("products")} className="h-10 px-5 border border-[#dbe1ee] rounded-md text-[#6b7280] hover:bg-white">Cancel</button>
                    <button onClick={handleAddProduct} disabled={loading} className="h-10 px-6 rounded-md bg-[#2f5cf6] text-white hover:bg-[#244ade] disabled:opacity-60">
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>

                {/* two-column layout for product form */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
                  {/* left column: main fields */}
                  <div className="space-y-5">
                    {/* information section */}
                    <div className="bg-white border border-[#e7ebf4] rounded-xl p-6">
                      <h2 className="text-[22px] font-semibold text-[#1f2937] mb-4">Information</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-[#6b7280] mb-1">Product Name</label>
                          <input
                            value={productForm.name}
                            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                            className="w-full h-11 border border-[#dbe1ee] rounded-md px-3 text-sm focus:outline-none focus:border-[#95a4d1]"
                            placeholder="Summer T-Shirt"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6b7280] mb-1">Product Description</label>
                          <textarea
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            className="w-full border border-[#dbe1ee] rounded-md px-3 py-2 text-sm h-24 focus:outline-none focus:border-[#95a4d1]"
                            placeholder="Product description"
                          />
                        </div>
                      </div>
                    </div>

                    {/* images section */}
                    <div className="bg-white border border-[#e7ebf4] rounded-xl p-6">
                      <h2 className="text-[22px] font-semibold text-[#1f2937] mb-4">Images</h2>
                      <div
                        onClick={() => productImageInputRef.current?.click()}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const file = e.dataTransfer?.files?.[0];
                          handleProductImageFile(file);
                        }}
                        className="border-2 border-dashed border-[#dbe1ee] rounded-md p-10 text-center cursor-pointer hover:border-[#95a4d1] transition-colors"
                      >
                        <button type="button" className="border border-[#dbe1ee] rounded px-5 py-1.5 text-sm text-[#4b5568] bg-white">Add File</button>
                        <p className="text-sm text-[#9aa3b8] mt-3">Or drag and drop files</p>
                        <input
                          ref={productImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            handleProductImageFile(file);
                            e.target.value = "";
                          }}
                          className="hidden"
                        />
                        <input
                          type="text"
                          value={productForm.image}
                          onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                          placeholder="Image URL"
                          className="mt-4 w-full border border-[#dbe1ee] rounded-md p-2 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>

                    {/* price section */}
                    <div className="bg-white border border-[#e7ebf4] rounded-xl p-6">
                      <h2 className="text-[22px] font-semibold text-[#1f2937] mb-4">Price</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-[#6b7280] mb-1">Product Price</label>
                          <input
                            type="number"
                            value={productForm.price}
                            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                            className="w-full h-11 border border-[#dbe1ee] rounded-md px-3 text-sm"
                            placeholder="Enter price"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6b7280] mb-1">Discount Price</label>
                          <input
                            type="number"
                            value={discountPrice}
                            onChange={(e) => setDiscountPrice(e.target.value)}
                            className="w-full h-11 border border-[#dbe1ee] rounded-md px-3 text-sm"
                            placeholder="Price at Discount"
                          />
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 mt-4 text-sm text-[#374151]">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={addTax}
                          onClick={() => setAddTax((prev) => !prev)}
                          className={`relative h-6 w-11 rounded-full transition-colors ${addTax ? "bg-[#2f5cf6]" : "bg-[#d1d5db]"}`}
                        >
                          <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${addTax ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                        <span>Add tax for this product</span>
                      </div>
                    </div>

                    {/* different options section (size/color/material) */}
                    <div className="bg-white border border-[#e7ebf4] rounded-xl p-6">
                      <h2 className="text-[22px] font-semibold text-[#1f2937] mb-4">Different Options</h2>
                      <div className="inline-flex items-center gap-2 mb-4 text-sm text-[#374151]">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={hasMultipleOptions}
                          onClick={() => setHasMultipleOptions((prev) => !prev)}
                          className={`relative h-6 w-11 rounded-full transition-colors ${hasMultipleOptions ? "bg-[#2f5cf6]" : "bg-[#d1d5db]"}`}
                        >
                          <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${hasMultipleOptions ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                        <span>This product has multiple options</span>
                      </div>
                      {hasMultipleOptions && (
                        <div className="space-y-3">
                          {optionGroups.map((group, index) => (
                            <div key={group.id} className="space-y-2">
                              <p className="text-sm font-medium text-[#374151]">Option {index + 1}</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm text-[#6b7280] mb-1">Size</label>
                                  <select
                                    value={group.type}
                                    onChange={(e) => handleOptionTypeChange(group.id, e.target.value)}
                                    className="w-full h-11 border border-[#dbe1ee] rounded-md px-3 text-sm bg-white"
                                  >
                                    <option>Size</option>
                                    <option>Color</option>
                                    <option>Material</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm text-[#6b7280] mb-1">Value</label>
                                  <div className="w-full min-h-11 border border-[#dbe1ee] rounded-md px-2 py-1.5 flex flex-wrap gap-2">
                                    {group.values.map((value) => (
                                      <span
                                        key={`${group.id}-${value}`}
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                                          group.type === "Color" ? "bg-[#f3f4f6] text-[#374151]" : "bg-[#eef2ff] text-[#4f46e5]"
                                        }`}
                                      >
                                        {group.type === "Color" && (
                                          <span
                                            className="w-2.5 h-2.5 rounded-full border border-[#d1d5db]"
                                            style={{ backgroundColor: value.toLowerCase() }}
                                          />
                                        )}
                                        {value}
                                        <button type="button" onClick={() => handleRemoveOptionValue(group.id, value)} className="text-[#7c85a2] hover:text-[#374151]">x</button>
                                      </span>
                                    ))}
                                    <input
                                      value={group.input}
                                      onChange={(e) => handleOptionInputChange(group.id, e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          e.preventDefault();
                                          handleAddOptionValue(group.id);
                                        }
                                      }}
                                      className="flex-1 min-w-[90px] text-sm outline-none"
                                      placeholder="Add value"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <button type="button" onClick={handleAddOptionGroup} className="text-sm text-[#2f5cf6] hover:text-[#244ade]">Add More</button>
                        </div>
                      )}
                    </div>

                    {/* shipping section */}
                    <div className="bg-white border border-[#e7ebf4] rounded-xl p-6">
                      <h2 className="text-[22px] font-semibold text-[#1f2937] mb-4">Shipping</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-[#6b7280] mb-1">Weight</label>
                          <input
                            value={shippingWeight}
                            onChange={(e) => setShippingWeight(e.target.value)}
                            disabled={isShippingDisabled}
                            className={`w-full h-11 border border-[#dbe1ee] rounded-md px-3 text-sm ${isShippingDisabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
                            placeholder="Enter Weight"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6b7280] mb-1">Country</label>
                          <select
                            value={shippingCountry}
                            onChange={(e) => setShippingCountry(e.target.value)}
                            disabled={isShippingDisabled}
                            className={`w-full h-11 border border-[#dbe1ee] rounded-md px-3 text-sm bg-white ${isShippingDisabled ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
                          >
                            <option value="">Select Country</option>
                            <option value="US">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AE">UAE</option>
                            <option value="IR">Iran</option>
                          </select>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-2 mt-4 text-sm text-[#374151]">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={isDigitalItem}
                          onClick={() =>
                            setIsDigitalItem((prev) => {
                              const next = !prev;
                              if (!next) {
                                setShippingWeight("");
                                setShippingCountry("");
                              }
                              return next;
                            })
                          }
                          className={`relative h-6 w-11 rounded-full transition-colors ${isDigitalItem ? "bg-[#2f5cf6]" : "bg-[#d1d5db]"}`}
                        >
                          <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${isDigitalItem ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                        <span>This is digital item</span>
                      </div>
                    </div>
                  </div>

                  {/* right column: categories, tags, SEO */}
                  <div className="space-y-5">
                    {/* categories selector */}
                    <div className="bg-white border border-[#e7ebf4] rounded-xl p-5">
                      <h3 className="text-lg font-semibold text-[#1f2937] mb-3">Categories</h3>
                      <div className="space-y-2">
                        {categories.map((cat) => (
                          <label key={cat.id} className="flex items-center gap-2 text-sm text-[#374151]">
                            <input
                              type="checkbox"
                              checked={selectedAddProductCategories.includes(cat.name)}
                              onChange={() => handleToggleAddProductCategory(cat.name)}
                              className="rounded"
                            />
                            <span>{cat.name}</span>
                          </label>
                        ))}
                      </div>
                      <button type="button" onClick={() => setShowAddCategoryModal(true)} className="text-sm text-[#2f5cf6] mt-3 hover:text-[#244ade]">
                        Create New
                      </button>
                    </div>

                    {/* tags section */}
                    <div className="bg-white border border-[#e7ebf4] rounded-xl p-5">
                      <h3 className="text-lg font-semibold text-[#1f2937] mb-3">Tags</h3>
                      <label className="block text-sm text-[#6b7280] mb-2">Add Tags</label>
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddProductTag();
                          }
                        }}
                        className="w-full h-10 border border-[#dbe1ee] rounded-md px-3 text-sm mb-3"
                        placeholder="Enter tag name"
                      />
                      <div className="flex flex-wrap gap-2">
                        {productTags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#eef2ff] text-xs text-[#4f46e5]">
                            {tag}
                            <button type="button" onClick={() => handleRemoveProductTag(tag)} className="text-[#7c85a2] hover:text-[#374151]">x</button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* SEO settings */}
                    <div className="bg-white border border-[#e7ebf4] rounded-xl p-5">
                      <h3 className="text-lg font-semibold text-[#1f2937] mb-3">SEO Settings</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-[#6b7280] mb-1">Title</label>
                          <input
                            value={seoTitle}
                            onChange={(e) => setSeoTitle(e.target.value)}
                            className="w-full h-10 border border-[#dbe1ee] rounded-md px-3 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#6b7280] mb-1">Description</label>
                          <textarea
                            value={seoDescription}
                            onChange={(e) => setSeoDescription(e.target.value)}
                            className="w-full h-24 border border-[#dbe1ee] rounded-md px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* bottom buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setPage("products")} className="h-10 px-5 border border-[#dbe1ee] rounded-md text-[#6b7280] hover:bg-white">Cancel</button>
                  <button onClick={handleAddProduct} disabled={loading} className="h-10 px-6 rounded-md bg-[#2f5cf6] text-white hover:bg-[#244ade] disabled:opacity-60">
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
            
            {/* CATEGORIES PAGE (grid view) */}
            {page === "categories" && !showCategoryDetail && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl leading-none font-semibold text-[#202a3d]">Categories</h1>
                  <button 
                    onClick={() => setShowAddCategoryModal(true)} 
                    className="bg-[#2f5cf6] text-white px-4 py-2 rounded-md text-sm hover:bg-[#244ade]"
                  >
                    + Add Category
                  </button>
                </div>
                
                {/* loading or empty state */}
                {loading && categories.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-xl shadow-sm">Loading...</div>
                ) : categories.length === 0 ? (
                  <div className="bg-white rounded-lg border border-[#eef1f7] h-[420px] flex items-center justify-center text-center px-8">
                    <div>
                      <div className="relative w-[88px] h-[88px] mx-auto mb-4">
                        <div className="absolute left-[18px] top-[34px] w-[56px] h-[36px] bg-[#2f5cf6] rounded-sm"></div>
                        <div className="absolute left-[54px] top-[34px] w-[20px] h-[36px] bg-[#0f172a] rounded-sm"></div>
                        <div className="absolute left-[12px] top-[28px] w-[42px] h-[12px] bg-[#d5def6] skew-x-[-25deg] rounded-sm"></div>
                        <div className="absolute left-[34px] top-[2px] w-[32px] h-[32px] rounded-full bg-[#2f5cf6] flex items-center justify-center">
                          <span className="text-white text-xs">❤</span>
                        </div>
                      </div>
                      <h3 className="text-2xl leading-tight font-semibold text-[#182237] mb-3">Create First Category</h3>
                      <p className="text-[#818aa0] text-base leading-relaxed max-w-2xl mx-auto mb-6">
                        Organize all your items in stock by creating and adding them to categories.
                        <br />
                        Categories helps to find items faster for your customers.
                      </p>
                      <button onClick={() => setShowAddCategoryModal(true)} className="bg-[#2f5cf6] text-white px-6 py-2.5 rounded-md text-base hover:bg-[#244ade]">+ Add Category</button>
                      <div className="mt-5">
                        <button className="text-[#2f5cf6] text-base">Read More</button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* categories grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {categories.map((category) => {
                      const itemsCount = getProductsByCategory(category.name).length;
                      const previewImage =
                        category.image ||
                        getProductsByCategory(category.name)[0]?.image ||
                        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80";

                      return (
                        <div
                          key={category.id}
                          onClick={() => handleViewCategory(category)}
                          className="group bg-white rounded-md overflow-hidden border border-[#eceff6] cursor-pointer relative"
                        >
                          <div className="relative h-[190px] bg-[#eef2f8]">
                            <img
                              src={previewImage}
                              alt={category.name}
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80";
                              }}
                            />

                            {/* hover overlay with edit/delete buttons */}
                            <div className="absolute inset-0 bg-[#3d4a73]/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCategory(category);
                                  setCategoryForm({ name: category.name, image: category.image || "" });
                                  setShowEditCategoryModal(true);
                                }}
                                className="bg-white text-[#2f5cf6] h-10 px-6 rounded text-sm font-medium flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedId(category.id);
                                  setSelectedDeleteType("category");
                                  setShowDeleteModal(true);
                                }}
                                className="bg-white text-red-500 h-10 px-4 rounded text-sm font-medium flex items-center gap-2 hover:bg-red-50"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </div>

                          <div className="px-5 py-4">
                            <h3 className="text-xl leading-none font-semibold text-[#202a3d] mb-2">{category.name}</h3>
                            <p className="text-sm leading-none text-[#9aa3b8]">{itemsCount} items</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* CATEGORY DETAIL VIEW (single category with its products) */}
            {showCategoryDetail && selectedCategory && (
              <div>
                <div className="mb-6">
                  <button 
                    onClick={() => setShowCategoryDetail(false)} 
                    className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Categories
                  </button>
                  <h1 className="text-3xl font-semibold text-gray-800">{selectedCategory.name}</h1>
                  <p className="text-gray-500 mt-1">Products {getProductsByCategory(selectedCategory.name).length}</p>
                </div>
                
                {/* products in this category (max 8) */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {getProductsByCategory(selectedCategory.name).slice(0, 8).map((product, idx) => (
                    <div
                      key={product.id ?? idx}
                      className="flex items-center justify-between gap-3 p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">${Number(product.price || 0).toFixed(2)}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(product.id);
                          setSelectedDeleteType("product");
                          setShowDeleteModal(true);
                        }}
                        className="shrink-0 inline-flex items-center justify-center h-9 px-3 rounded-md border border-red-200 text-red-600 hover:bg-red-50 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
                
                {getProductsByCategory(selectedCategory.name).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No products in this category yet.
                  </div>
                )}
                
                {/* visibility toggle */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="font-semibold mb-4">Category Visibility</h3>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={getCategoryVisibility(selectedCategory)} 
                      onChange={(e) => handleToggleCategoryVisibility(e.target.checked)} 
                      className="rounded" 
                    />
                    <span className="text-sm text-gray-700">Visible on site</span>
                  </label>
                </div>
                
                {/* edit category name */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="font-semibold mb-4">Category Info</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                    <input 
                      value={selectedCategory.name} 
                      onChange={(e) => setSelectedCategory({...selectedCategory, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2" 
                    />
                  </div>
                </div>
                
                {/* category image upload */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="font-semibold mb-4">Image</h3>
                  <div
                    onClick={() => categoryImageInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer?.files?.[0];
                      handleCategoryImageFile(file);
                    }}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  >
                    <svg className="w-10 h-10 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 mt-2">Add File</p>
                    <p className="text-sm text-gray-400">Or drag and drop files</p>
                    <input
                      ref={categoryImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        handleCategoryImageFile(file);
                        e.target.value = "";
                      }}
                      className="hidden"
                    />
                    <input 
                      type="text" 
                      value={selectedCategory.image || ""} 
                      onChange={(e) => setSelectedCategory({...selectedCategory, image: e.target.value})}
                      placeholder="Image URL" 
                      className="mt-4 w-full border border-gray-300 rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* ORDERS PAGE */}
            {page === "orders" && (
              <div>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl leading-none font-semibold text-[#202a3d]">Orders</h1>
                    <p className="text-sm text-[#6b7280] mt-2">
                      Recent orders pulled from admin dashboard data.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={fetchDashboardData}
                      className="h-10 px-5 rounded-md border border-[#dbe1ee] bg-white text-[#5f6b86] text-sm hover:bg-[#f7f9ff]"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {Array.isArray(dashboardData?.orders) && dashboardData.orders.length > 0 ? (
                  <div className="bg-white rounded-xl border border-[#e7ebf4] overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#eef1f6] flex items-center justify-between gap-3">
                      <p className="text-sm text-[#6b7280]">
                        Showing <span className="font-semibold text-[#202a3d]">{dashboardData.orders.length}</span>{" "}
                        recent orders
                      </p>
                      <p className="text-xs text-[#9aa6bf]">
                        Total orders:{" "}
                        <span className="font-semibold text-[#202a3d]">
                          {typeof dashboardData?.stats?.totalOrders === "number"
                            ? dashboardData.stats.totalOrders
                            : dashboardData.orders.length}
                        </span>
                      </p>
                    </div>

                    <div className="overflow-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-[#f7f9ff] text-[#6b7280]">
                          <tr>
                            <th className="text-left font-semibold px-5 py-3">Order #</th>
                            <th className="text-left font-semibold px-5 py-3">User</th>
                            <th className="text-left font-semibold px-5 py-3">Total</th>
                            <th className="text-left font-semibold px-5 py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#eef1f6]">
                          {dashboardData.orders.map((order) => (
                            <tr key={order.id} className="hover:bg-[#fbfcff]">
                              <td className="px-5 py-3 font-semibold text-[#202a3d]">#{order.id}</td>
                              <td className="px-5 py-3 text-[#5f6b86]">
                                {order.user_id != null ? `User ${order.user_id}` : "-"}
                              </td>
                              <td className="px-5 py-3 text-[#202a3d]">
                                {order.total_price != null ? `$${order.total_price}` : "-"}
                              </td>
                              <td className="px-5 py-3">
                                <span
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    order.status === "completed"
                                      ? "bg-green-50 text-green-700"
                                      : order.status === "cancelled"
                                        ? "bg-red-50 text-red-700"
                                        : "bg-amber-50 text-amber-800"
                                  }`}
                                >
                                  {order.status || "pending"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-[#e7ebf4] p-12 text-center">
                    <h3 className="text-lg font-semibold text-[#202a3d] mb-2">No Orders Yet</h3>
                    <p className="text-[#6b7280]">
                      Orders will appear here after you receive purchases.
                    </p>
                    <button
                      type="button"
                      onClick={fetchDashboardData}
                      className="mt-6 h-10 px-6 rounded-md bg-[#2f5cf6] text-white text-sm hover:bg-[#244ade]"
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* OTHER PAGES (placeholder for customers, reports, coupons, inbox) */}
            {(page === "customers" || page === "reports" || page === "coupons" || page === "inbox") && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">{page.charAt(0).toUpperCase() + page.slice(1)}</h2>
                <p className="text-gray-500">This section is under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* EDIT PRODUCT MODAL */}
      {showEditProductModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit Product</h2>
              <button onClick={() => setShowEditProductModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  value={productForm.name} 
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-2" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={productForm.description} 
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-2 h-24" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input 
                  type="number" 
                  value={productForm.price} 
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-2" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={productForm.category} 
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-2"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input 
                  value={productForm.color} 
                  onChange={(e) => setProductForm({...productForm, color: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-2" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                <input 
                  value={productForm.size} 
                  onChange={(e) => setProductForm({...productForm, size: e.target.value})} 
                  className="w-full border border-gray-300 rounded-lg p-2" 
                />
              </div>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={productForm.in_stock} 
                  onChange={(e) => setProductForm({...productForm, in_stock: e.target.checked})} 
                  className="rounded" 
                />
                <span className="text-sm text-gray-700">In Stock</span>
              </label>
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={productForm.is_new} 
                  onChange={(e) => setProductForm({...productForm, is_new: e.target.checked})} 
                  className="rounded" 
                />
                <span className="text-sm text-gray-700">New Product</span>
              </label>
            </div>
            <div className="p-6 border-t flex justify-end space-x-3">
              <button onClick={() => setShowEditProductModal(false)} className="px-4 py-2 border rounded-lg text-gray-700">Cancel</button>
              <button onClick={handleUpdateProduct} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* EDIT CATEGORY MODAL */}
      {showEditCategoryModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Category</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input 
                value={categoryForm.name} 
                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} 
                className="w-full border border-gray-300 rounded-lg p-2" 
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input 
                value={categoryForm.image} 
                onChange={(e) => setCategoryForm({...categoryForm, image: e.target.value})} 
                className="w-full border border-gray-300 rounded-lg p-2" 
                placeholder="Image URL"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowEditCategoryModal(false); setSelectedCategory(null); }} className="px-4 py-2 border rounded-lg text-gray-700">Cancel</button>
              <button onClick={handleUpdateCategory} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* ADD CATEGORY MODAL */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-md w-full max-w-[700px] shadow-xl border border-gray-100">
            <div className="flex items-center justify-between px-8 pt-6 pb-4">
              <h3 className="text-2xl leading-none font-semibold text-[#1f2937]">Add Category</h3>
              <button
                onClick={() => { setShowAddCategoryModal(false); setCategoryForm({name: "", image: ""}); }}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="px-8 pb-6">
              <div className="mb-6">
                <label className="block text-base text-[#6b7280] mb-2">Category Name</label>
                <input 
                  value={categoryForm.name} 
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} 
                  className="w-full h-12 border border-[#dbe1ee] rounded-sm px-4 text-base text-[#374151] focus:outline-none focus:border-[#b8c2db]" 
                  placeholder="Women Clothes" 
                />
              </div>

              <div className="mb-8">
                <label className="block text-base text-[#6b7280] mb-2">Add Products</label>
                <select
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full h-12 border border-[#dbe1ee] rounded-sm px-4 text-base text-[#374151] focus:outline-none focus:border-[#b8c2db] bg-white"
                >
                  <option value="">Choose a Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.name}>{product.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-6">
                <button
                  onClick={() => { setShowAddCategoryModal(false); setCategoryForm({name: "", image: ""}); }}
                  className="text-base text-[#6b7280] hover:text-[#374151]"
                >
                  Cancel
                </button>
                <button onClick={handleAddCategory} disabled={loading} className="h-12 px-8 bg-[#2f5cf6] text-white rounded text-base hover:bg-[#244ade]">
                  {loading ? "Creating..." : "Create Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-2">Delete {selectedDeleteType === "product" ? "Product" : "Category"}</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this {selectedDeleteType}? This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 border rounded-lg text-gray-700">Cancel</button>
              <button 
                onClick={() => {
                  if (selectedDeleteType === "product") {
                    handleDeleteProduct(selectedId);
                  } else {
                    handleDeleteCategory(selectedId);
                  }
                }} 
                disabled={loading} 
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* SUCCESS MODAL (toast-like) */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 text-center w-80">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-800 font-medium mb-4">{successMessage}</p>
            <button onClick={() => setShowSuccessModal(false)} className="bg-blue-600 text-white px-6 py-2 rounded-lg">OK</button>
          </div>
        </div>
      )}
    </div>
  );
}