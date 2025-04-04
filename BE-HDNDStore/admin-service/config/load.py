import os
import pandas as pd
import json
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
import datetime

# Hàm chuyển đổi ngày cho JSON
def date_converter(obj):
    if isinstance(obj, (pd.Timestamp, datetime.date)):
        return obj.strftime('%Y-%m-%d')
    raise TypeError(f"Type {type(obj)} not serializable")

# Tạo đường dẫn tuyệt đối cho file CSV
base_dir = os.path.dirname(os.path.abspath(__file__))  # Lấy thư mục chứa file Python
csv_file_path = os.path.join(base_dir, "../exports/delivered_orders.csv")  # Đường dẫn tuyệt đối đến file CSV

# Đọc file CSV
df = pd.read_csv(csv_file_path)

# In thử dữ liệu
print(df.head())

# Chuyển cartItems từ chuỗi -> object
df['cartItems'] = df['cartItems'].apply(lambda x: json.loads(x))

# Tạo cột số lượng sản phẩm trong đơn
df['num_items'] = df['cartItems'].apply(lambda x: len(x))

# Chuyển đổi ngày
df['orderDate'] = pd.to_datetime(df['orderDate'])

# ======= PHÂN TÍCH VÀ LƯU KẾT QUẢ ===========

# Doanh thu theo phương thức thanh toán
payment_revenue = df.groupby('paymentMethod')['finalAmount'].sum().reset_index()

# Phân tích số lượng sản phẩm bán ra
product_sales = []
for items in df['cartItems']:
    for item in items:
        product_sales.append(item['name'])
product_sales_count = Counter(product_sales)
product_sales_df = pd.DataFrame(product_sales_count.items(), columns=['Product', 'Sales'])

# Doanh thu theo sản phẩm
df_exploded = df.explode('cartItems')
df_exploded['product_name'] = df_exploded['cartItems'].apply(lambda x: x['name'])
df_exploded['product_revenue'] = df_exploded['finalAmount'] / df_exploded['num_items']
product_revenue = df_exploded.groupby('product_name')['product_revenue'].sum().reset_index()

# Số lượng đơn hàng theo ngày
df['orderDate_day'] = df['orderDate'].dt.date
daily_orders = df.groupby('orderDate_day').size().reset_index(name='orderCount')

# Tỷ lệ đơn theo phương thức thanh toán
payment_method_count = df['paymentMethod'].value_counts().to_dict()

# Phân loại sản phẩm theo giới tính
gender_products = {'Nam': [], 'Nữ': []}
for items in df['cartItems']:
    for item in items:
        if 'nam' in item['category'].lower():
            gender_products['Nam'].append(item['name'])
        elif 'nữ' in item['category'].lower():
            gender_products['Nữ'].append(item['name'])
gender_counts = {gender: len(products) for gender, products in gender_products.items()}

# ========== TỔNG HỢP KẾT QUẢ PHÂN TÍCH ==========

analysis_results = {
    "paymentRevenue": payment_revenue.to_dict(orient="records"),
    "topSellingProducts": product_sales_df.sort_values(by='Sales', ascending=False).head(10).to_dict(orient="records"),
    "productRevenue": product_revenue.sort_values(by='product_revenue', ascending=False).to_dict(orient="records"),
    "dailyOrders": daily_orders.to_dict(orient="records"),
    "paymentMethodDistribution": payment_method_count,
    "genderDistribution": gender_counts
}


# Đường dẫn ra folder 'exports' cùng cấp với 'configs'
export_dir = os.path.join(base_dir, "../exports")
os.makedirs(export_dir, exist_ok=True)

# Đường dẫn file JSON
json_output_path = os.path.join(export_dir, "analysis_results.json")

# Ghi file kết quả
with open(json_output_path, "w") as json_file:
    json.dump(analysis_results, json_file, indent=4, default=date_converter)

print("✅ Đã lưu kết quả phân tích vào analysis_results.json")

# ========== VẼ BIỂU ĐỒ (tuỳ chọn) ==========

# 1. Doanh thu theo phương thức thanh toán
plt.figure(figsize=(8, 6))
sns.barplot(x='paymentMethod', y='finalAmount', data=payment_revenue)
plt.title('Tổng doanh thu theo phương thức thanh toán')
plt.xlabel('Phương thức thanh toán')
plt.ylabel('Tổng doanh thu')
plt.tight_layout()
# plt.show()

# 2. Top 10 sản phẩm bán chạy
plt.figure(figsize=(12, 8))
sns.barplot(x='Sales', y='Product', data=product_sales_df.sort_values(by='Sales', ascending=False).head(10))
plt.title('Top 10 sản phẩm bán chạy nhất')
plt.xlabel('Số lượng bán ra')
plt.ylabel('Sản phẩm')
plt.tight_layout()
# plt.show()

# 3. Pie chart doanh thu theo sản phẩm
plt.figure(figsize=(8, 8))
plt.pie(product_revenue['product_revenue'], labels=product_revenue['product_name'], autopct='%1.1f%%', startangle=140)
plt.title('Doanh thu theo sản phẩm')
plt.tight_layout()
# plt.show()

# 4. Đơn hàng theo ngày
plt.figure(figsize=(10, 6))
sns.lineplot(x='orderDate_day', y='orderCount', data=daily_orders)
plt.title('Số lượng đơn hàng theo ngày')
plt.xlabel('Ngày')
plt.ylabel('Số lượng đơn hàng')
plt.xticks(rotation=45)
plt.tight_layout()
# plt.show()

# 5. Pie chart theo phương thức thanh toán
plt.figure(figsize=(8, 8))
plt.pie(payment_method_count.values(), labels=payment_method_count.keys(), autopct='%1.1f%%', startangle=140)
plt.title('Tỷ lệ đơn hàng theo phương thức thanh toán')
plt.tight_layout()
# plt.show()

# 6. Bar chart giới tính sản phẩm
plt.figure(figsize=(8, 6))
sns.barplot(x=list(gender_counts.keys()), y=list(gender_counts.values()))
plt.title('Số lượng sản phẩm nam và nữ')
plt.xlabel('Giới tính')
plt.ylabel('Số lượng sản phẩm')
plt.tight_layout()
# plt.show()

# 7. Pie chart giới tính sản phẩm
plt.figure(figsize=(8, 8))
plt.pie(gender_counts.values(), labels=gender_counts.keys(), autopct='%1.1f%%', startangle=140)
plt.title('Tỷ lệ sản phẩm Nam/Nữ')
plt.tight_layout()
# plt.show()
