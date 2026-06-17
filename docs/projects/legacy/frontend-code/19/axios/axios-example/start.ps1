# PowerShell脚本用于启动Vue和Strapi项目

# 获取命令行参数
param(
    [string]$project = ""
)

# 设置项目路径
$VUE_PROJECT_PATH = "."
$STRAPI_PROJECT_PATH = ".\server-strapi"

# 颜色输出函数
function Write-ColorOutput($ForegroundColor, $Message) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

# 启动Vue前端
function Start-VueProject {
    Write-ColorOutput "Green" "启动Vue前端项目..."
    Set-Location -Path $VUE_PROJECT_PATH
    npm run dev
}

# 启动Strapi后端
function Start-StrapiProject {
    Write-ColorOutput "Blue" "启动Strapi后端项目..."
    Set-Location -Path $STRAPI_PROJECT_PATH
    npm run develop
}

# 根据参数启动对应项目
switch ($project.ToLower()) {
    "vue" {
        Start-VueProject
        break
    }
    "strapi" {
        Start-StrapiProject
        break
    }
    default {
        Write-ColorOutput "Yellow" "同时启动Vue和Strapi项目..."
        
        # 在新窗口中启动Vue前端
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$((Get-Location).Path)'; npm run dev"
        
        # 在新窗口中启动Strapi后端
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$((Get-Location).Path)\server-strapi'; npm run develop"
    }
}