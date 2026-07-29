const fs = require('fs');
let file = fs.readFileSync('src/pages/auth/RegisterSchoolPage.tsx', 'utf8');
const index = file.indexOf('</AnimatePresence>');
if (index !== -1) {
    const start = file.substring(0, index + '</AnimatePresence>'.length);
    const newEnd = `
          </div>
        </div>
      </div>
      </div>
      </main>
      <FooterSection onNavigate={navigate} />
      <RegistrationCertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        registrationId={registrationId || ""}
      />
    </div>
  );
};`;
    fs.writeFileSync('src/pages/auth/RegisterSchoolPage.tsx', start + newEnd);
}
