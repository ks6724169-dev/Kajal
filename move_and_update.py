import os
import re

moves = {
    'src/components/EnterpriseShell.tsx': 'src/core/EnterpriseShell.tsx',
    'src/contexts/AuthContext.tsx': 'src/core/AuthContext.tsx',
    'src/lib/supabase.ts': 'src/services/supabase.ts',
    'src/api/core.ts': 'src/services/api.ts',
    'src/lib/rbac.ts': 'src/core/rbac.ts',
    'src/navigation/index.ts': 'src/config/navigation.ts',
    'src/data/mockData.ts': 'src/constants/mockData.ts',
    'src/types.ts': 'src/types/index.ts',
    'src/components/Navbar.tsx': 'src/layouts/Navbar.tsx',
    'src/components/LandingPage.tsx': 'src/features/LandingPage.tsx',
    'src/components/LoginPage.tsx': 'src/features/LoginPage.tsx',
    'src/components/SchoolRegistrationModal.tsx': 'src/features/SchoolRegistrationModal.tsx',
    'src/components/TeacherPanel': 'src/modules/teacher/TeacherPanel',
}

# The rest of components go to src/modules/super-admin
components = [
    'AiHub.tsx', 'AttendancePortal.tsx', 'CctvSecurity.tsx', 'Dashboard.tsx',
    'ExaminationPortal.tsx', 'FeeManagement.tsx', 'HrmsPayroll.tsx',
    'InventoryLibraryHostel.tsx', 'MobileAppSimulator.tsx', 'SettingsModal.tsx',
    'StudentsPortal.tsx', 'TransportPortal.tsx'
]

for comp in components:
    moves[f'src/components/{comp}'] = f'src/modules/super-admin/{comp}'

import shutil
from pathlib import Path

# Move files
for src, dst in moves.items():
    if os.path.exists(src):
        dst_path = Path(dst)
        dst_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(src, dst)

# Also create empty dirs
empty_dirs = [
    'src/modules/student', 'src/modules/parent', 'src/modules/principal',
    'src/modules/school-owner', 'src/shared', 'src/hooks', 'src/utils', 'src/assets'
]
for d in empty_dirs:
    Path(d).mkdir(parents=True, exist_ok=True)

# Delete empty dirs
try:
    shutil.rmtree('src/components')
    shutil.rmtree('src/contexts')
    shutil.rmtree('src/lib')
    shutil.rmtree('src/api')
    shutil.rmtree('src/data')
    shutil.rmtree('src/navigation')
except:
    pass

# Update imports in all files
def fix_imports(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Generic replaces based on old paths to new paths
    # We will compute relative paths instead, but an easier way is to just use absolute paths if it was tsconfig configured, but it's not.
    # So we replace known strings
    
    # We can just use string replacements for common imports
    replacements = {
        '../components/': '../', # Too generic, need to be careful
    }
    
    # It's easier to find the depth of the current file and construct the correct relative path to src
    depth = len(Path(file_path).parts) - 2 # e.g. src/App.tsx -> 0, src/core/AuthContext.tsx -> 1, src/modules/teacher/TeacherPanel/index.tsx -> 3
    if depth < 0: depth = 0
    prefix = '../' * depth if depth > 0 else './'

    def get_rel_path(target_src_path):
        # target_src_path is like 'core/AuthContext'
        if depth == 0:
            return f"./{target_src_path}"
        else:
            return f"{prefix}{target_src_path}"

    new_content = content
    # Replace imports like: from './types', from '../types', from '../../types'
    new_content = re.sub(r"from\s+['\"](?:\.\./)*types['\"]", f"from '{get_rel_path('types')}'", new_content)
    new_content = re.sub(r"from\s+['\"](?:\.\./)*data/mockData['\"]", f"from '{get_rel_path('constants/mockData')}'", new_content)
    new_content = re.sub(r"from\s+['\"](?:\.\./)*(?:components/)?EnterpriseShell['\"]", f"from '{get_rel_path('core/EnterpriseShell')}'", new_content)
    new_content = re.sub(r"from\s+['\"](?:\.\./)*(?:contexts/)?AuthContext['\"]", f"from '{get_rel_path('core/AuthContext')}'", new_content)
    new_content = re.sub(r"from\s+['\"](?:\.\./)*(?:lib/)?supabase['\"]", f"from '{get_rel_path('services/supabase')}'", new_content)
    new_content = re.sub(r"from\s+['\"](?:\.\./)*(?:lib/)?rbac['\"]", f"from '{get_rel_path('core/rbac')}'", new_content)
    new_content = re.sub(r"from\s+['\"](?:\.\./)*(?:navigation|navigation/index)['\"]", f"from '{get_rel_path('config/navigation')}'", new_content)
    new_content = re.sub(r"from\s+['\"](?:\.\./)*(?:config/)?env['\"]", f"from '{get_rel_path('config/env')}'", new_content)
    
    # Components mapping
    comp_map = {
        'Navbar': 'layouts/Navbar',
        'LandingPage': 'features/LandingPage',
        'LoginPage': 'features/LoginPage',
        'SchoolRegistrationModal': 'features/SchoolRegistrationModal',
        'TeacherPanel': 'modules/teacher/TeacherPanel',
        'AiHub': 'modules/super-admin/AiHub',
        'AttendancePortal': 'modules/super-admin/AttendancePortal',
        'CctvSecurity': 'modules/super-admin/CctvSecurity',
        'Dashboard': 'modules/super-admin/Dashboard',
        'ExaminationPortal': 'modules/super-admin/ExaminationPortal',
        'FeeManagement': 'modules/super-admin/FeeManagement',
        'HrmsPayroll': 'modules/super-admin/HrmsPayroll',
        'InventoryLibraryHostel': 'modules/super-admin/InventoryLibraryHostel',
        'MobileAppSimulator': 'modules/super-admin/MobileAppSimulator',
        'SettingsModal': 'modules/super-admin/SettingsModal',
        'StudentsPortal': 'modules/super-admin/StudentsPortal',
        'TransportPortal': 'modules/super-admin/TransportPortal'
    }
    
    for comp_name, comp_path in comp_map.items():
        # Match from './components/Navbar', '../components/Navbar', etc.
        new_content = re.sub(r"from\s+['\"](?:\.\./)*(?:components/)?" + comp_name + r"['\"]", f"from '{get_rel_path(comp_path)}'", new_content)

    if new_content != content:
        with open(file_path, 'w') as f:
            f.write(new_content)

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            fix_imports(os.path.join(root, file))

