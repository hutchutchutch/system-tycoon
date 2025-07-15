import React from 'react';
import { Card } from '../../../atoms/Card';
import { Badge } from '../../../atoms/Badge';
import { Button } from '../../../atoms/Button';
import { Shield } from 'lucide-react';

export const CertificatePreview: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 to-green-50 p-8 shadow-xl">
      <div className="bg-white p-6 rounded">
        <div className="text-center mb-4">
          <Shield className="w-16 h-16 mx-auto text-blue-600" />
          <h3 className="text-2xl font-bold mt-2">SaaS Impact Developer</h3>
          <p className="text-gray-600">Certified Social Impact Engineer</p>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Certificate ID:</span>
            <span className="font-mono">#SW2A5D8K9</span>
          </div>
          <div className="flex justify-between">
            <span>Issued:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Blockchain Verified:</span>
            <Badge variant="success" size="sm">✓</Badge>
          </div>
        </div>
        
        <Button variant="primary" fullWidth className="mt-4">
          Verify Certificate
        </Button>
      </div>
    </Card>
  );
};