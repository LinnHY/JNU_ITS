export function getParams() {
    // 获取 Hash 部分的 URL（去掉 # 开头）
    const hash = window.location.hash || "";
    const queryString = hash.includes("?") ? hash.split("?")[1] : ""; // 获取 ? 后的部分
    const params = new URLSearchParams(queryString);

    const source_id = params.get("source_id");
    const role = params.get("role");
    console.log("source_id=", source_id);
    console.log("role=", role);
    return {
        source_id: source_id ? Number(source_id) : null,
        role: role ? Number(role) : null,
    };
}
