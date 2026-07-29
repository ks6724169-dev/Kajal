const fs = require('fs');
let file = fs.readFileSync('src/pages/auth/RegisterSchoolPage.tsx', 'utf8');
const searchStr = `            </AnimatePresence>
          </div>
        </div>
      </div>
      </div>
      </main>`;
const replaceStr = `            </AnimatePresence>
          </div>
        </div>
      </div>
      </main>`;
file = file.replace(searchStr, replaceStr);
fs.writeFileSync('src/pages/auth/RegisterSchoolPage.tsx', file);
