const supabase = require("../config/supabase");

exports.getAllProducts = async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  res.status(200).json({ success: true, data, count: data.length });
};
