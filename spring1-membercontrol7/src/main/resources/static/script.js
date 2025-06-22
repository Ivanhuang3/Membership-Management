// API 基礎路徑
const API_BASE = '/brad07';

// DOM 元素
const memberForm = document.getElementById('memberForm');
const membersList = document.getElementById('membersList');
const loadingMessage = document.getElementById('loadingMessage');
const messageBox = document.getElementById('messageBox');
const searchInput = document.getElementById('searchInput');

// 表單元素
const memberIdInput = document.getElementById('memberId');
const accountInput = document.getElementById('account');
const passwdInput = document.getElementById('passwd');
const realnameInput = document.getElementById('realname');
const submitBtn = document.getElementById('submitBtn');

// 當前編輯模式
let isEditMode = false;

// 頁面載入時初始化
document.addEventListener('DOMContentLoaded', function() {
    loadAllMembers();
    
    // 表單提交事件
    memberForm.addEventListener('submit', handleFormSubmit);
    
    // 搜尋框 Enter 鍵事件
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchMembers();
        }
    });
});

// 處理表單提交
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const memberData = {
        account: accountInput.value.trim(),
        passwd: passwdInput.value.trim(),
        realname: realnameInput.value.trim()
    };
    
    // 驗證表單
    if (!memberData.account || !memberData.passwd || !memberData.realname) {
        showMessage('請填寫所有欄位', 'error');
        return;
    }
    
    try {
        if (isEditMode) {
            await updateMember(memberIdInput.value, memberData);
        } else {
            await createMember(memberData);
        }
    } catch (error) {
        console.error('操作失敗:', error);
        showMessage('操作失敗: ' + error.message, 'error');
    }
}

// 創建新會員
async function createMember(memberData) {
    try {
        const response = await fetch(`${API_BASE}/member`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memberData)
        });
        
        const result = await response.json();
        
        if (result.error === 0) {
            showMessage('會員新增成功！', 'success');
            resetForm();
            loadAllMembers();
        } else {
            showMessage(result.mesg || '新增失敗', 'error');
        }
    } catch (error) {
        throw new Error('網路錯誤');
    }
}

// 更新會員
async function updateMember(id, memberData) {
    try {
        // 更新時不傳送密碼
        const updateData = {
            account: memberData.account,
            realname: memberData.realname
        };
        
        const response = await fetch(`${API_BASE}/member/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        
        const result = await response.json();
        
        if (result.error === 0) {
            showMessage('會員更新成功！', 'success');
            resetForm();
            loadAllMembers();
        } else {
            showMessage(result.mesg || '更新失敗', 'error');
        }
    } catch (error) {
        throw new Error('網路錯誤');
    }
}

// 載入所有會員
async function loadAllMembers() {
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/members`);
        const result = await response.json();
        
        if (result.error === 0) {
            displayMembers(result.data || []);
        } else {
            showMessage('載入會員資料失敗: ' + result.mesg, 'error');
            displayMembers([]);
        }
    } catch (error) {
        console.error('載入會員失敗:', error);
        showMessage('載入會員資料失敗', 'error');
        displayMembers([]);
    } finally {
        showLoading(false);
    }
}

// 搜尋會員
async function searchMembers() {
    const keyword = searchInput.value.trim();
    
    if (!keyword) {
        showMessage('請輸入搜尋關鍵字', 'warning');
        return;
    }
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_BASE}/members/search/${encodeURIComponent(keyword)}`);
        const result = await response.json();
        
        if (result.error === 0) {
            displayMembers(result.data || []);
            showMessage(`找到 ${result.data ? result.data.length : 0} 筆資料`, 'success');
        } else {
            showMessage('搜尋失敗: ' + result.mesg, 'error');
            displayMembers([]);
        }
    } catch (error) {
        console.error('搜尋失敗:', error);
        showMessage('搜尋失敗', 'error');
        displayMembers([]);
    } finally {
        showLoading(false);
    }
}

// 顯示會員列表
function displayMembers(members) {
    if (!members || members.length === 0) {
        membersList.innerHTML = '<div class="no-data">📋 暫無會員資料</div>';
        return;
    }
    
    const membersHTML = members.map(member => `
        <div class="member-card">
            <div class="member-info">
                <h3>👤 ${escapeHtml(member.realname)}</h3>
                <p><strong>帳號：</strong>${escapeHtml(member.account)}</p>
                <p><strong>ID：</strong>${member.id}</p>
            </div>
            <div class="member-actions">
                <button class="edit-btn" onclick="editMember(${member.id})">
                    ✏️ 編輯
                </button>
                <button class="delete-btn" onclick="deleteMember(${member.id}, '${escapeHtml(member.realname)}')">
                    🗑️ 刪除
                </button>
            </div>
        </div>
    `).join('');
    
    membersList.innerHTML = membersHTML;
}

// 編輯會員
async function editMember(id) {
    try {
        const response = await fetch(`${API_BASE}/member/${id}`);
        const result = await response.json();
        
        if (result.error === 0 && result.data) {
            const member = result.data;
            
            // 填入表單
            memberIdInput.value = member.id;
            accountInput.value = member.account;
            realnameInput.value = member.realname;
            passwdInput.value = ''; // 密碼欄位清空
            passwdInput.placeholder = '留空表示不更改密碼';
            passwdInput.required = false; // 編輯時密碼非必填
            
            // 切換到編輯模式
            isEditMode = true;
            submitBtn.textContent = '💾 更新會員';
            submitBtn.style.background = '#4299e1';
            
            // 滾動到表單
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            showMessage('無法載入會員資料', 'error');
        }
    } catch (error) {
        console.error('載入會員資料失敗:', error);
        showMessage('載入會員資料失敗', 'error');
    }
}

// 刪除會員
async function deleteMember(id, name) {
    if (!confirm(`確定要刪除會員「${name}」嗎？此操作無法復原。`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/member/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.error === 0) {
            showMessage('會員刪除成功！', 'success');
            loadAllMembers();
        } else {
            showMessage(result.mesg || '刪除失敗', 'error');
        }
    } catch (error) {
        console.error('刪除會員失敗:', error);
        showMessage('刪除會員失敗', 'error');
    }
}

// 重置表單
function resetForm() {
    memberForm.reset();
    memberIdInput.value = '';
    passwdInput.placeholder = '請輸入密碼';
    passwdInput.required = true;
    
    // 恢復新增模式
    isEditMode = false;
    submitBtn.textContent = '💾 新增會員';
    submitBtn.style.background = '#48bb78';
}

// 顯示/隱藏載入中訊息
function showLoading(show) {
    loadingMessage.style.display = show ? 'block' : 'none';
    membersList.style.display = show ? 'none' : 'block';
}

// 顯示訊息提示
function showMessage(message, type = 'success') {
    messageBox.textContent = message;
    messageBox.className = `message-box ${type} show`;
    
    // 3 秒後自動隱藏
    setTimeout(() => {
        messageBox.className = 'message-box';
    }, 3000);
}

// HTML 轉義函數
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 工具函數：格式化日期
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW');
} 