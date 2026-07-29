const fs = require('fs');
let file = fs.readFileSync('src/pages/auth/RegisterSchoolPage.tsx', 'utf8');

const originalEnd = `      <RegistrationCertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        registrationId={registrationId || ""}
      />
    </div>
  );
};`;

const newEnd = `        </div>
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

file = file.replace(originalEnd, newEnd);
fs.writeFileSync('src/pages/auth/RegisterSchoolPage.tsx', file);
