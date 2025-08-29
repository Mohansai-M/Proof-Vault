export function filterCertificates(certificates, query) {
  if (!query) return certificates;

  const lowerQuery = query.toLowerCase();
  return certificates.filter(
    (cert) =>
      cert.issuer.toLowerCase().includes(lowerQuery) ||
      cert.receiver.toLowerCase().includes(lowerQuery)
  );
}
