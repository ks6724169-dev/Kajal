const fs = require('fs');
let file = fs.readFileSync('src/pages/auth/RegisterSchoolPage.tsx', 'utf8');
const searchStr = `            </p>
          </div>

        {/* Live CSS Interactive Dashboard Graphic */}`;
const replaceStr = `            </p>
          </div>
        </div>

        {/* Live CSS Interactive Dashboard Graphic */}`;
file = file.replace(searchStr, replaceStr);
fs.writeFileSync('src/pages/auth/RegisterSchoolPage.tsx', file);
